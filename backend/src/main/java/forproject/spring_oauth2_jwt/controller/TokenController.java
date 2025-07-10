package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.jwt.JWTUtil;
import forproject.spring_oauth2_jwt.service.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
//
//@RestController
//public class TokenController {
//
//    @GetMapping("/api/token")
//    public ResponseEntity<?> getToken(HttpServletRequest request) {
//        Cookie[] cookies = request.getCookies();
//        String token = null;
//        if (cookies != null) {
//            for (Cookie cookie : cookies) {
//                if ("Authorization".equals(cookie.getName())) {
//                    token = cookie.getValue();
//                    break;
//                }
//            }
//        }
//        if (token != null) {
//            return ResponseEntity.ok().body(Collections.singletonMap("token", token));
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token not found");
//        }
//    }
//}
@RestController
public class TokenController {

    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public TokenController(JWTUtil jwtUtil, RefreshTokenService refreshTokenService) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/api/token")
    public ResponseEntity<?> getAccessTokenByRefresh(HttpServletRequest request, HttpServletResponse response) {
        // 1. refresh 쿠키 추출
        Cookie[] cookies = request.getCookies();
        String refreshToken = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refresh".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "No refresh token"));
        }

        // 2. refresh 토큰 검증 및 username 추출
        try {
            String username = jwtUtil.getUsername(refreshToken);
            String role = jwtUtil.getRole(refreshToken);
            String category = jwtUtil.getCategory(refreshToken);
            if (!"refresh".equals(category)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Invalid refresh token"));
            }

            // (선택) Redis에서 refresh 토큰 비교 검증
            if (!refreshTokenService.isValid(refreshToken, username)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Refresh token mismatch"));
            }

            // 3. access 토큰 새로 발급 (ex. 10분)
//            String access = jwtUtil.createJwt("access", username, role, 600_000L);
            String access = jwtUtil.createJwt("access", username, role, 3000L);
            response.setHeader("access", access);

            // (선택) 사용자 정보도 같이 반환
            return ResponseEntity.ok(Collections.singletonMap("message", "access token issued"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Invalid token"));
        }
    }
}
