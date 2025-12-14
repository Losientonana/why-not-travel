package forproject.spring_oauth2_jwt.service;


import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailVerificationCodeService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    //redis 키 접두사
    // Redis Key 접두사
    private static final String VERIFY_CODE_PREFIX = "email:verify:";
    private static final String VERIFIED_PREFIX = "email:verified:";
    private static final String RATE_LIMIT_PREFIX = "email:ratelimit:";

    // TTL 설정 (분 단위)
    private static final int CODE_EXPIRATION_MINUTES = 5;
    private static final int VERIFIED_EXPIRATION_MINUTES = 10;
    private static final int RATE_LIMIT_HOURS = 1;

    // Rate Limit 설정
    private static final int MAX_SEND_COUNT = 5;

    /**
     * 6자리 랜덤 인증 코드 생성
     */
    public String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // 100000 ~ 999999
        return String.valueOf(code);
    }

    /**
     * 인증 코드를 Redis에 저장
     * @param email 사용자 이메일
     * @param code 6자리 인증 코드
     */
    public void saveVerificationCode(String email, String code) {
        String key = VERIFY_CODE_PREFIX + email;
        redisTemplate.opsForValue().set(
                key,
                code,
                CODE_EXPIRATION_MINUTES,
                TimeUnit.MINUTES
        );
        log.info("인증 코드 저장: email={}, key={}, TTL={}분", email, key,
                CODE_EXPIRATION_MINUTES);
    }

    /**
     * 인증 코드 검증
     * @param email 사용자 이메일
     * @param inputCode 사용자가 입력한 코드
     * @return 검증 성공 여부
     */
    public boolean verifyCode(String email, String inputCode) {
        String key = VERIFY_CODE_PREFIX + email;
        String savedCode = redisTemplate.opsForValue().get(key);

        log.info("인증 코드 검증: email={}, 입력코드={}, 저장코드={}", email, inputCode,
                savedCode);

        if (savedCode == null) {
            log.warn("인증 코드 없음 or 만료: email={}", email);
            return false;
        }

        boolean isValid = savedCode.equals(inputCode);

        if (isValid) {
            // 검증 성공 시: 인증 완료 상태 저장 + 코드 삭제
            markAsVerified(email);
            deleteVerificationCode(email);
            log.info("인증 성공: email={}", email);
        } else {
            log.warn("인증 실패: email={}, 코드 불일치", email);
        }

        return isValid;
    }

    /**
     * 인증 완료 상태 저장
     */
    private void markAsVerified(String email) {
        String key = VERIFIED_PREFIX + email;
        redisTemplate.opsForValue().set(
                key,
                "true",
                VERIFIED_EXPIRATION_MINUTES,
                TimeUnit.MINUTES
        );
        log.info("인증 완료 마크: email={}, TTL={}분", email, VERIFIED_EXPIRATION_MINUTES);
    }

    /**
     * 이메일이 인증 완료 상태인지 확인
     */
    public boolean isEmailVerified(String email) {
        String key = VERIFIED_PREFIX + email;
        String value = redisTemplate.opsForValue().get(key);
        boolean verified = "true".equals(value);
        log.info("인증 상태 확인: email={}, verified={}", email, verified);
        return verified;
    }

    /**
     * 인증 완료 상태 삭제 (회원가입 완료 후 호출)
     */
    public void deleteVerifiedStatus(String email) {
        String key = VERIFIED_PREFIX + email;
        redisTemplate.delete(key);
        log.info("인증 완료 상태 삭제: email={}", email);
    }

    /**
     * 인증 코드 삭제
     */
    private void deleteVerificationCode(String email) {
        String key = VERIFY_CODE_PREFIX + email;
        redisTemplate.delete(key);
        log.info("인증 코드 삭제: email={}", email);
    }

    /**
     * Rate Limit 체크 (1시간에 5번)
     */
    public void checkRateLimit(String email) {
        String key = RATE_LIMIT_PREFIX + email;
        String countStr = redisTemplate.opsForValue().get(key);

        int count = (countStr != null) ? Integer.parseInt(countStr) : 0;

        if (count >= MAX_SEND_COUNT) {
            throw new RuntimeException("너무 많은 요청입니다. 1시간 후 다시 시도해주세요.");
        }

        // 횟수 증가
        redisTemplate.opsForValue().increment(key);

        // 첫 요청이면 TTL 설정
        if (count == 0) {
            redisTemplate.expire(key, RATE_LIMIT_HOURS, TimeUnit.HOURS);
        }

        log.info("Rate Limit: email={}, count={}/{}", email, count + 1, MAX_SEND_COUNT);
    }
}
