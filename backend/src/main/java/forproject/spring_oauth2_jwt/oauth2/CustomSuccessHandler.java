package forproject.spring_oauth2_jwt.oauth2;

import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.jwt.JWTUtil;
import forproject.spring_oauth2_jwt.service.RefreshTokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${jwt.access-token.expiration}")
    private Long accessTokenExpiration;

    @Value("${jwt.refresh-token.expiration}")
    private Long refreshTokenExpiration;

    @Value("${jwt.refresh-cookie.max-age}")
    private Integer refreshCookieMaxAge;

    @Value("${cookie.secure}")
    private boolean cookieSecure;

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

        // email을 사용하여 JWT를 생성합니다.
        String access = jwtUtil.createJwt("access", email, role, accessTokenExpiration);      // 15분
        String refresh = jwtUtil.createJwt("refresh", email, role, refreshTokenExpiration); // 7일

        // Redis에 Refresh 토큰을 email을 key로 하여 저장합니다.
        refreshTokenService.save(email, refresh, refreshTokenExpiration); // 7일

        //응답 설정
        response.setHeader("access", access);
        response.addHeader("Set-Cookie", createCookie("refresh", refresh));
        response.setStatus(HttpStatus.OK.value());

        response.sendRedirect(frontendUrl + "/oauth2/redirect");
    }

    private String createCookie(String key, String value) {
        ResponseCookie cookie = ResponseCookie.from(key, value)
                .maxAge(600 * 600 * 600)
                .path("/")
                .domain(".whynottravel.xyz")  // 최상위 도메인 설정 (api, www 공유)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("None")  // 크로스 사이트 쿠키 지원
                .build();

        return cookie.toString();
    }
}
