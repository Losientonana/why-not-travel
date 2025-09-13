package forproject.spring_oauth2_jwt.oauth2;

import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.jwt.JWTUtil;
import forproject.spring_oauth2_jwt.service.RefreshTokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public CustomSuccessHandler(JWTUtil jwtUtil, RefreshTokenService refreshTokenService) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws
            IOException, ServletException {

        //OAuth2User
        UserPrincipal customOAuth2User = (UserPrincipal) authentication.getPrincipal();

        // 사용자 정보에서 email과 role을 추출합니다.
        String email = customOAuth2User.getEmail();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        // email을 사용하여 JWT를 생성합니다. (실무 표준: Access 15분, Refresh 7일)
        String access = jwtUtil.createJwt("access", email, role, 900000L);      // 15분
        String refresh = jwtUtil.createJwt("refresh", email, role, 604800000L); // 7일

        // Redis에 Refresh 토큰을 email을 key로 하여 저장합니다.
        refreshTokenService.save(email, refresh, 604_800_000L); // 7일

        //응답 설정
        response.setHeader("access", access);
        response.addCookie(createCookie("refresh", refresh));
        response.setStatus(HttpStatus.OK.value());

        response.sendRedirect("http://localhost:3000/oauth2/redirect");
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(600 * 600 * 600);
        //cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}
