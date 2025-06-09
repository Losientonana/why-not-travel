package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.UserDTO;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class MyController {
    @GetMapping("/my")
    public ResponseEntity<?> myAPI(Authentication authentication, HttpServletResponse response, HttpServletRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        dto.setEmail(user.getEmail());
        dto.setNickname(user.getNickname());

        // [중요!] accessToken이 헤더에 있으면 응답 헤더에도 실어주기 (콜백 이후 최초 1회만)
        String accessToken = request.getHeader("access");
        if (accessToken != null) {
            response.setHeader("access", accessToken);
        }
        return ResponseEntity.ok(dto);
    }

}
