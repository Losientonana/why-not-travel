package forproject.spring_oauth2_jwt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

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
        String savedToken = redisTemplate.opsForValue().get("refresh:" + username);
        return refreshToken.equals(savedToken);
    }

    // 삭제
    public void delete(String username) {
        redisTemplate.delete("refresh:" + username);
    }
}
