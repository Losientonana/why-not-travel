package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.jwt.JWTUtil;
import forproject.spring_oauth2_jwt.service.RefreshTokenService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class ReissueController {
//
//    private final JWTUtil jwtUtil;
//
//    public ReissueController(JWTUtil jwtUtil) {
//
//        this.jwtUtil = jwtUtil;
//    }
//
//    @PostMapping("/reissue")
//    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
//
//        //get refresh token
//        String refresh = null;
//        Cookie[] cookies = request.getCookies();
//        for (Cookie cookie : cookies) {
//
//            if (cookie.getName().equals("refresh")) {
//
//                refresh = cookie.getValue();
//            }
//        }
//
//        if (refresh == null) {
//
//            //response status code
//            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
//        }
//
//        //expired check
//        try {
//            jwtUtil.isExpired(refresh);
//        } catch (ExpiredJwtException e) {
//
//            //response status code
//            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
//        }
//
//        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
//        String category = jwtUtil.getCategory(refresh);
//
//        if (!category.equals("refresh")) {
//
//            //response status code
//            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
//        }
//
//        String username = jwtUtil.getUsername(refresh);
//        String role = jwtUtil.getRole(refresh);
//
//        //make new JWT
//        String newAccess = jwtUtil.createJwt("access", username, role, 600000L);
//        // 리프레쉬 토큰 사용해서 새 토큰 발행(?)
//        String newRefresh = jwtUtil.createJwt("refresh", username, role, 86400000L);
//
//        //response
//        response.setHeader("access", newAccess);
//        response.addCookie(createCookie("refresh", newRefresh));
//
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//    private Cookie createCookie(String key, String value) {
//
//        Cookie cookie = new Cookie(key, value);
//        cookie.setMaxAge(24*60*60);
//        //cookie.setSecure(true);
//        //cookie.setPath("/");
//        cookie.setHttpOnly(true);
//
//        return cookie;
//    }
//}
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
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        String category = jwtUtil.getCategory(refresh);
        if (!"refresh".equals(category)) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        String username = jwtUtil.getUsername(refresh);

        // Redis에서 해당 유저의 토큰이 맞는지 확인
        if (!refreshTokenService.isValid(refresh, username)) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        String role = jwtUtil.getRole(refresh);
        String newAccess = jwtUtil.createJwt("access", username, role, 600_000L);
        String newRefresh = jwtUtil.createJwt("refresh", username, role, 86_400_000L);

        // 기존 Refresh 삭제 후 새로 저장
        refreshTokenService.delete(username);
        refreshTokenService.save(username, newRefresh, 86_400_000L);

        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(86_400);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        return cookie;
    }
}
