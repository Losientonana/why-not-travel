//package forproject.spring_oauth2_jwt.config;
//
////import forproject.spring_oauth2_jwt.interceptor.NicknameCheckInterceptor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebMvcConfig implements WebMvcConfigurer {
//
////    private final NicknameCheckInterceptor nicknameCheckInterceptor;
////
////    @Autowired
////    public WebMvcConfig(NicknameCheckInterceptor nicknameCheckInterceptor) {
////        this.nicknameCheckInterceptor = nicknameCheckInterceptor;
////    }
//
//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        registry.addInterceptor(nicknameCheckInterceptor)
//                .addPathPatterns("/**")
//                .excludePathPatterns(
//                        "/login", "/join", "/oauth2/**", "/nickname", "/reissue", "/api/token", "/static/**", "/css/**", "/js/**", "/images/**",
//                        "/api/login", "/api/join", "/api/logout", "/api/user/me"
//                );
//        // 모든 요청에 대해 적용
//    }
//}
//
