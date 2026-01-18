package forproject.spring_oauth2_jwt.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthCheckController {
    private String env;

    @GetMapping("/hc")
    public ResponseEntity<?> healthCheck() {
        Map<String,String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "🚀 AUTO DEPLOY SUCCESS!");
        response.put("version", "5.0.0");
        response.put("deployedAt", java.time.LocalDateTime.now().toString());

        return ResponseEntity.ok().body(response);
    }
    @GetMapping("/env")
    public ResponseEntity<?> getEnv() {
        return ResponseEntity.ok(env);
    }

}
