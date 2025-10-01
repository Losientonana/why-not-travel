package forproject.spring_oauth2_jwt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SpringOauth2JwtApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringOauth2JwtApplication.class, args);
    }

}
