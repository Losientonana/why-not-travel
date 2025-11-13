package forproject.spring_oauth2_jwt.config;

//import forproject.spring_oauth2_jwt.interceptor.NicknameCheckInterceptor;

import forproject.spring_oauth2_jwt.jwt.JWTFilter;
import forproject.spring_oauth2_jwt.jwt.JWTUtil;
import forproject.spring_oauth2_jwt.jwt.LoginFilter;
import forproject.spring_oauth2_jwt.oauth2.CustomSuccessHandler;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import forproject.spring_oauth2_jwt.service.CustomLogoutFilter;
import forproject.spring_oauth2_jwt.service.CustomOAuth2UserService;
import forproject.spring_oauth2_jwt.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserRepository userRepository;
    // 인증 매니저를 생성할 수 있는 설정 객체
    private final AuthenticationConfiguration authenticationConfiguration;
    // 소셜 로그인 시 사용자의 정보를 처리하는 서비스
    private final CustomOAuth2UserService customOAuth2UserService;
    // OAuth2 로그인 성공 후 후처리 핸들러
    private final CustomSuccessHandler customSuccessHandler;
    // JWT 생성 및 파싱 유틸리티
    private final JWTUtil jwtUtil;
    //Redis 사용
    private final RefreshTokenService refreshTokenService;


    // 인증 매니저 빈을 직접 등록해서 필터에서 사용 가능하게 함
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // 해시 알고리즘(BCrypt)
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }


    public SecurityConfig(UserRepository userRepository, AuthenticationConfiguration authenticationConfiguration, CustomOAuth2UserService customOAuth2UserService, CustomSuccessHandler customSuccessHandler, JWTUtil jwtUtil, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.authenticationConfiguration = authenticationConfiguration;
        this.customOAuth2UserService = customOAuth2UserService;
        this.customSuccessHandler = customSuccessHandler;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 프론트와 백엔드가 서로 다른 도메인에 있을때, 클라이언트에서의 요청을 허용하도록 설정
                .cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {

                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                        CorsConfiguration configuration = new CorsConfiguration();

                        // 해당 경로만 허용
                        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
                        // GET POST PUT DELETE 모두 허용
                        configuration.setAllowedMethods(Collections.singletonList("*"));
                        // 클라이언트로부터 쿠키나 인증 정보를 포함한 요청을 허용 -> true 를 해야 JWT 토큰을 담은 쿠키가 백엔드로 전송 가능
                        configuration.setAllowCredentials(true);
                        // 어떤 HTTP 헤더든 클라이언트가 사용할 수 있도록 허용
                        configuration.setAllowedHeaders(Collections.singletonList("*"));
                        // 브라우저가 사전 요청을 3600초 동안 캐싱하도록 설정
                        configuration.setMaxAge(3600L);

                        // 브라우저에서 접근 가능한 응답 헤더를 명시
//                        configuration.setExposedHeaders(Collections.singletonList("Set-Cookie"));
//                        configuration.setExposedHeaders(Collections.singletonList("Authorization"));
                        configuration.setExposedHeaders(Arrays.asList("Set-Cookie", "Authorization", "access"));


                        return configuration;
                    }
                }));

        //csrf disable
        http
                .csrf((auth) -> auth.disable());

        //From 로그인 방식 disable
        http
                .formLogin((auth) -> auth.disable());

        //HTTP Basic 인증 방식 disable
        http
                .httpBasic((auth) -> auth.disable());

        //경로별 인가 작업
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/api/trips/**","/api/login","/","/api/join", "/oauth2/**", "/reissue", "/api/token", "/api/logout", "/images/**", "/uploads/**", "/api/mock/**").permitAll()
                        .anyRequest().authenticated());

        // LoginFilter 가 실행되기 전에 JWT 필터를 먼저 실행( 헤더나 쿠키에서 토큰을 추출하여 사용자 인증) 하여 현재 요청을 보낸
        // 사용자가 인증된 유저인지, 정식으로 로그인 한 유저인지 확인하는 역할을 수행한다.
        http
                .addFilterBefore(new JWTFilter(jwtUtil,userRepository), LoginFilter.class);

        // 커스텀 LoginFilter 을 등록해서 로그인 요청을 받아 JWT 를 발급한다.
        http
                .addFilterAt(
                new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil,refreshTokenService),
                UsernamePasswordAuthenticationFilter.class
        );

        // 로그아웃 필터
        http
                .addFilterBefore(
                        new CustomLogoutFilter(jwtUtil,refreshTokenService ), LogoutFilter.class);

        //oauth2 커스텀 서비스를 등록해서 사용자 정보 처리 및 JWT 발급을 담당하는 핸들러 등록
        http
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(customSuccessHandler));

        //세션 설정 : STATELESS
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
