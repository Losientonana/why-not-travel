package forproject.spring_oauth2_jwt.interceptor;



import forproject.spring_oauth2_jwt.dto.UserDTO;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import forproject.spring_oauth2_jwt.jwt.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
public class NicknameCheckInterceptor implements HandlerInterceptor {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    // 닉네임 체크를 하지 않을 경로(로그인, 회원가입, 닉네임 등록 등)
    private static final List<String> EXCLUDE_PATHS = Arrays.asList(
                "/login", "/join", "/oauth2", "/oauth2/", "/oauth2/redirect", "/nickname", "/reissue", "/api/token", "/api/user/me"
        );

    public NicknameCheckInterceptor(JWTUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String path = request.getRequestURI();
        log.info("[Interceptor] 요청 경로: {}", path);

        // 예외 경로는 닉네임 검사 생략
        if (EXCLUDE_PATHS.stream().anyMatch(path::startsWith)) {
            log.info("[Interceptor] 제외 경로로 인해 통과: {}", path);
            return true;
        }

        // 1. 헤더에 JWT 토큰 있는지 확인
        String accessToken = request.getHeader("access");
        log.info("[Interceptor] access 토큰: {}", accessToken);

        if (accessToken == null){
            log.info("[Interceptor] access 토큰이 없음");
            return true;
        }
        if (jwtUtil.isExpired(accessToken)) {
            log.info("[Interceptor] access 토큰값이 만료");
            // 인증 자체가 안 된 경우는 Security에서 이미 처리 (401)
            return true;
        }

        // 2. 토큰에서 유저 정보 추출
        String username = jwtUtil.getUsername(accessToken);
        log.info("[Interceptor] username: {}", username);
        // 이부분(?)
        UserEntity user = userRepository.findByUsername(username);

        // 3. 로그인된 유저 중 닉네임 없는 경우만 거부
        if (user != null && (user.getNickname() == null || user.getNickname().trim().isEmpty())) {
            // 프론트에서 이 응답을 보고 /nickname으로 이동하도록 처리
            response.sendError(HttpServletResponse.SC_CONFLICT, "닉네임 등록 필요");
            log.info("닉네임 미등록 유저가 다른페이지 접근.");
            return false;
        }
        log.info("[Interceptor] 닉네임 존재함. 접근 허용");
        // 4. 닉네임이 존재하면 통과
        return true;
    }
}
