package forproject.spring_oauth2_jwt.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {

        //모든 경로에 대한 CORS 설정을 적용
        corsRegistry.addMapping("/**")
                // 여러 프론트엔드 도메인 허용 (환경변수에서 쉼표로 구분)
                .allowedOrigins(frontendUrl.split(","))
                // 허용할 HTTP 메서드
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                // 허용할 헤더
                .allowedHeaders("*")
                // 응답에서 클라이언트가 접근 가능한 헤더
                .exposedHeaders("Set-Cookie", "Authorization", "access")
                // 쿠키/인증 정보 포함 허용
                .allowCredentials(true)
                // preflight 요청 캐시 시간 (1시간)
                .maxAge(3600);
    }
}