//package forproject.spring_oauth2_jwt.jwt;
//
//import forproject.spring_oauth2_jwt.dto.CustomOAuth2User;
//import forproject.spring_oauth2_jwt.dto.UserDTO;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.Cookie;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//public class JWTFilter extends OncePerRequestFilter {
//
//    private final JWTUtil jwtUtil;
//
//    public JWTFilter(JWTUtil jwtUtil) {
//
//        this.jwtUtil = jwtUtil;
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//
//        //cookie들을 불러온 뒤 Authorization Key에 담긴 쿠키를 찾음
//        String authorization = null;
//        Cookie[] cookies = request.getCookies();
//        for (Cookie cookie : cookies) {
//
//            System.out.println(cookie.getName());
//            if (cookie.getName().equals("Authorization")) {
//
//                authorization = cookie.getValue();
//            }
//        }
//
//        //Authorization 헤더 검증
//        if (authorization == null) {
//
//            System.out.println("token null");
//            filterChain.doFilter(request, response);
//
//            //조건이 해당되면 메소드 종료 (필수)
//            return;
//        }
//
//        //토큰
//        String token = authorization;
//
//        //토큰 소멸 시간 검증
//        if (jwtUtil.isExpired(token)) {
//
//            System.out.println("token expired");
//            filterChain.doFilter(request, response);
//
//            //조건이 해당되면 메소드 종료 (필수)
//            return;
//        }
//
//        //토큰에서 username과 role 획득
//        String username = jwtUtil.getUsername(token);
//        String role = jwtUtil.getRole(token);
//
//        //userDTO를 생성하여 값 set
//        UserDTO userDTO = new UserDTO();
//        userDTO.setUsername(username);
//        userDTO.setRole(role);
//
//        //UserDetails에 회원 정보 객체 담기
//        CustomOAuth2User customOAuth2User = new CustomOAuth2User(userDTO);
//
//        //스프링 시큐리티 인증 토큰 생성
//        Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User, null, customOAuth2User.getAuthorities());
//        //세션에 사용자 등록
//        SecurityContextHolder.getContext().setAuthentication(authToken);
//
//        filterChain.doFilter(request, response);
//    }
//}


// JWTFilter.java (통합 버전)
package forproject.spring_oauth2_jwt.jwt;

import forproject.spring_oauth2_jwt.dto.UserDTO;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;

public class JWTFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;


    public JWTFilter(JWTUtil jwtUtil, UserRepository userRepository) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    //    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//
//        // 무한 재로그인 오류 해결을 위해
//        String requestUri = request.getRequestURI();
//        if (requestUri.matches("^/(login|oauth2|public|error)(/.*)?$")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//
//        String token = null;
//
//        // 1. Authorization 헤더에서 토큰 추출 (일반 로그인)
//        String authHeader = request.getHeader("Authorization");
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            token = authHeader.substring(7);
//        }
//
//        // 2. Authorization 쿠키에서 토큰 추출 (소셜 로그인)
//        if (token == null && request.getCookies() != null) {
//            for (Cookie cookie : request.getCookies()) {
//                if (cookie.getName().equals("Authorization")) {
//                    token = cookie.getValue();
//                    break;
//                }
//            }
//        }
//
//        // 토큰이 없거나 만료된 경우 다음 필터로 진행
//        if (token == null || jwtUtil.isExpired(token)) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        // 토큰에서 정보 추출
////        String username = jwtUtil.getUsername(token);
////        String role = jwtUtil.getRole(token);
////
////        // 인증 객체 생성
////        if (authHeader != null && authHeader.startsWith("Bearer ")) {
////            // 일반 로그인
////            UserEntity userEntity = new UserEntity();
////            userEntity.setUsername(username);
////            userEntity.setPassword("temppw");
////            userEntity.setRole(role);
////            UserPrincipal userDetails = new UserPrincipal(userEntity);
////            Authentication authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
////            SecurityContextHolder.getContext().setAuthentication(authToken);
////        } else {
////            // OAuth2 로그인
////            UserDTO userDTO = new UserDTO();
////            userDTO.setUsername(username);
////            userDTO.setRole(role);
////            UserPrincipal customOAuth2User = new UserPrincipal(userDTO);
////            Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User, null, customOAuth2User.getAuthorities());
////            SecurityContextHolder.getContext().setAuthentication(authToken);
////        }
////
////        filterChain.doFilter(request, response);
////    }
//        // 토큰에서 정보 추출 (username, role 등)
//        String username = jwtUtil.getUsername(token);
//        String role = jwtUtil.getRole(token);
//
//    // DB에서 사용자 정보 조회 (존재할 수도, 없을 수도 있음)
//        UserEntity userEntity = userRepository.findByUsername(username);
//
//        UserPrincipal userPrincipal; // 공통 인증 객체 선언
//
//        if (userEntity != null) {                                 // 1. DB에 해당 username이 있다면
//            userPrincipal = new UserPrincipal(userEntity);         // 2. UserEntity 기반으로 UserPrincipal 생성
//        } else {                                                  // 3. DB에 없을 때(소셜 최초 로그인 등)
//            UserDTO userDTO = new UserDTO();                      // 4. UserDTO 생성
//            userDTO.setUsername(username);                        // 5. username 세팅
//            userDTO.setRole(role);                                // 6. role 세팅
//            userPrincipal = new UserPrincipal(userDTO, null);     // 7. DTO 기반으로 UserPrincipal 생성(확장성을 위해 attributes는 null)
//        }
//
//        Authentication authToken = new UsernamePasswordAuthenticationToken(
//                userPrincipal, null, userPrincipal.getAuthorities());  // 8. UserPrincipal을 인증 객체로 wrapping
//        SecurityContextHolder.getContext().setAuthentication(authToken); // 9. Security 컨텍스트에 주입
//
//        filterChain.doFilter(request, response); // 10. 다음 필터로 요청 전달
//        }
//    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 로그인/회원가입 등 인증이 필요 없는 요청 예외처리
        String requestUri = request.getRequestURI();
        if (requestUri.matches("^/(login|oauth2|public|error)(/.*)?$")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. AccessToken 우선 검사 (헤더명은 상황에 따라 'Authorization', 'access', 'Bearer' 등으로 통일!)
        String accessToken = request.getHeader("access");
        if (accessToken == null) { // 헤더에서 access 토큰이 없으면, 쿠키에서 찾거나, 다음 필터로 넘김
            filterChain.doFilter(request, response);
            return;
        }

        // 3. AccessToken 유효성 체크
        try {
            jwtUtil.isExpired(accessToken); // 만료 검증 (예외 던지면 바로 catch로 감)
        } catch (ExpiredJwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter writer = response.getWriter();
            writer.print("{\"message\": \"access token expired\"}");
            writer.flush();
            return; // 만료된 경우는 더 이상 진행하지 않음
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter writer = response.getWriter();
            writer.print("{\"message\": \"invalid or malformed token\"}");
            writer.flush();
            return;
        }

        // 4. AccessToken의 "카테고리"가 "access"인지 확인 (발급시 category=access로 지정했다는 전제)
        String category = jwtUtil.getCategory(accessToken);
        if (!"access".equals(category)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter writer = response.getWriter();
            writer.print("{\"message\": \"invalid access token\"}");
            writer.flush();
            return;
        }

        // 5. 토큰에서 사용자 정보 추출
        String username = jwtUtil.getUsername(accessToken);
        String role = jwtUtil.getRole(accessToken);

        // 6. DB에 사용자 실존 확인 (보안 향상, 소셜 등 최초 가입 상태 고려)
        UserEntity userEntity = userRepository.findByUsername(username);
        UserPrincipal userPrincipal;
        if (userEntity != null) {
            userPrincipal = new UserPrincipal(userEntity);
        } else {
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(username);
            userDTO.setRole(role);
            userPrincipal = new UserPrincipal(userDTO, null);
        }

        // 7. SecurityContext에 인증 정보 세팅
        Authentication authToken = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // 8. 다음 필터로
        filterChain.doFilter(request, response);
    }
}
