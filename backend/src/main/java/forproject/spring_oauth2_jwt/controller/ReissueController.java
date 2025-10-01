package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.jwt.JWTUtil;
import forproject.spring_oauth2_jwt.service.RefreshTokenService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class ReissueController {

    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public ReissueController(JWTUtil jwtUtil, RefreshTokenService refreshTokenService) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        log.info("Attempting to reissue token...");

        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refresh".equals(cookie.getName())) {
                    refresh = cookie.getValue();
                }
            }
        }

        if (refresh == null) {
            log.warn("Refresh token is null.");
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        log.info("Found refresh token.");

        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            log.warn("Refresh token has expired.");
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        String category = jwtUtil.getCategory(refresh);
        if (!"refresh".equals(category)) {
            log.warn("Invalid token category: {}", category);
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        String email = jwtUtil.getEmail(refresh);

        if (!refreshTokenService.isValid(refresh, email)) {
            log.warn("Refresh token does not match the one in Redis for user: {}", email);
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        log.info("Refresh token is valid for user: {}", email);

        String role = jwtUtil.getRole(refresh);
        // 실무 표준: Access 15분, Refresh 7일
        String newAccess = jwtUtil.createJwt("access", email, role, 900_000L);      // 15분
        String newRefresh = jwtUtil.createJwt("refresh", email, role, 604_800_000L); // 7일

        refreshTokenService.delete(email);
        refreshTokenService.save(email, newRefresh, 604_800_000L); // 7일

        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        log.info("Successfully reissued tokens for userEmail: {}", email);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(604_800); // 7일
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        return cookie;
    }
}