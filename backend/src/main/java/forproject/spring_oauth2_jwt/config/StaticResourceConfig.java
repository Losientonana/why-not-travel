package forproject.spring_oauth2_jwt.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드된 이미지 파일에 대한 정적 리소스 핸들러 추가
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + uploadDir + "/")
                .setCachePeriod(3600); // 1시간 캐시
    }
}