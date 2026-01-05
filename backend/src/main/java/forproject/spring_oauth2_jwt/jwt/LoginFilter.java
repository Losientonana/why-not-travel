//package forproject.spring_jwt.jwt;
//
//import forproject.spring_jwt.dto.CustomUserDetails;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import java.io.IOException;
//import java.util.Collection;
//import java.util.Iterator;
//
//public class LoginFilter extends UsernamePasswordAuthenticationFilter {
//    private final AuthenticationManager authenticationManager;
//
//    private final JWTUtil jwtUtil;
//
//    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
//        this.authenticationManager = authenticationManager;
//        this.jwtUtil = jwtUtil;
//    }
//
//    @Override
//    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
//
//        // 클라이언트 요청에서 username, password 추출
//        String username = obtainUsername(request);
//        String password = obtainPassword(request);
//
//        // Authentication Manager에게 값을 전달해주기 위해 ,스프링 시큐리티에서 username 과 password 를 검증하기 위해서는 token 에 담아야한다.
//        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);
//
//        //token에 담은 검증을 위한 AuthenticationManager로 전달하면, authenticationManager로 이동하면, 반대로 db에서 유저정보를 갖고와서 userDetails로 이동시킨후
//        //검증을 진행한다.
//        return authenticationManager.authenticate(authToken);
//    }
//
//        //로그인 성공시 실행하는 메소드 ( 여기서 jwt를 발행하면 됨)
//    @Override
//    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
//        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
//        String username = customUserDetails.getUsername();
//
//
//        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
//        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
//        GrantedAuthority auth = iterator.next();
//
//        String role = auth.getAuthority();
//
//        String token = jwtUtil.createJwt(username, role, 600*600*10L);
//        response.addHeader("Authorization", "Bearer " + token);
//    }
//
//    //로그인 실패시 실행하는 메소드
//    @Override
//    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
//
//        response.setStatus(401);
//
//    }
//}

// 위 코드 버전은 multipart/form-data 형태로 데이터를 응답받음.
// 아래 코드는 json 형태로 데이터를 주고 받음
//
package forproject.spring_oauth2_jwt.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;

import forproject.spring_oauth2_jwt.dto.LoginDTO;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.service.RefreshTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Iterator;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;

    private final JWTUtil jwtUtil;

    private final RefreshTokenService refreshTokenService;

    @Value("${jwt.access-token.expiration}")
    private Long accessTokenExpiration;

    @Value("${jwt.refresh-token.expiration}")
    private Long refreshTokenExpiration;

    @Value("${jwt.refresh-cookie.max-age}")
    private Integer refreshCookieMaxAge;

    @Value("${cookie.secure}")
    private boolean cookieSecure;

    LoginDTO loginDTO = new LoginDTO();
    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshTokenService refreshTokenService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;

        this.setFilterProcessesUrl("/api/login");
        this.setUsernameParameter("email");
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ServletInputStream inputStream = request.getInputStream();
            String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            loginDTO = objectMapper.readValue(messageBody, LoginDTO.class);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        System.out.println(loginDTO.getEmail());

        String email = loginDTO.getEmail();
        String password = loginDTO.getPassword();

        // Authentication Manager에게 값을 전달해주기 위해 ,스프링 시큐리티에서 username 과 password 를 검증하기 위해서는 token 에 담아야한다.
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password, null);

        //token에 담은 검증을 위한 AuthenticationManager로 전달하면, authenticationManager로 이동하면, 반대로 db에서 유저정보를 갖고와서 userDetails로 이동시킨후
        //검증을 진행한다.
        return authenticationManager.authenticate(authToken);
    }

    //로그인 성공시 실행하는 메소드 ( 여기서 jwt를 발행하면 됨)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {

            //유저 정보 (email로 통일)
            String email = authentication.getName(); // 실제로는 email이 들어옴 (setUsernameParameter("email") 설정 때문)

            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
            Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
            GrantedAuthority auth = iterator.next();
            String role = auth.getAuthority();

            //토큰 생성 (실무 표준: Access 15분, Refresh 7일)
            String access = jwtUtil.createJwt("access", email, role, accessTokenExpiration);      // 15분
            String refresh = jwtUtil.createJwt("refresh", email, role, refreshTokenExpiration); // 7일

            // Redis에 Refresh 저장 (email을 key로 사용)
            refreshTokenService.save(email, refresh, 604_800_000L); // 7일

            //응답 설정
            response.setHeader("access", access);
            response.addHeader("Set-Cookie", createCookie("refresh", refresh));
            response.setStatus(HttpStatus.OK.value());
        }
    private String createCookie(String key, String value) {
        ResponseCookie cookie = ResponseCookie.from(key, value)
                .maxAge(24*60*60)
                .path("/")
                .domain(".whynotravel.xyz")  // 최상위 도메인 설정 (api, www 공유)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("None")  // 크로스 사이트 쿠키 지원
                .build();

        return cookie.toString();
    }

    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {

        response.setStatus(401);

    }
}



