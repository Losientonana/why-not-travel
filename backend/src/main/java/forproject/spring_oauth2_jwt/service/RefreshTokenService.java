package forproject.spring_oauth2_jwt.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class RefreshTokenService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // Refresh 토큰 저장
    public void save(String username, String refreshToken, long expireMs) {
        redisTemplate.opsForValue().set(
                "refresh:" + username,
                refreshToken,
                expireMs,
                TimeUnit.MILLISECONDS
        );
    }

    // 저장된 토큰과 비교 (검증)
    public boolean isValid(String refreshToken, String username) {
        String key = "refresh:" + username;
        String savedToken = redisTemplate.opsForValue().get(key);

        // 디버깅을 위한 로그 추가
        log.info("--- Refresh Token Validation ---");
        log.info("Key for Redis: {}", key);
        log.info("Token from Cookie: {}", refreshToken);
        log.info("Token from Redis:  {}", savedToken);

        boolean result = refreshToken.equals(savedToken);
        log.info("Validation Result (Tokens Match): {}", result);
        log.info("--------------------------------");

        return result;
    }

    // 삭제
    public void delete(String username) {
        redisTemplate.delete("refresh:" + username);
    }
}
