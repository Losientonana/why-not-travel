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
                // 응답에서 클라이언트가 접근 가능한 헤더에 "Set- Cookie"를 추가
                .exposedHeaders("Set-Cookie", "Authorization", "access")
                // 오직 3000번 포트에서 오는 요청만 허용
                .allowedOrigins(frontendUrl);
    }
}