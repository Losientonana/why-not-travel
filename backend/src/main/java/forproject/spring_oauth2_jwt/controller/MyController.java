package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.UserDTO;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class MyController {
    @GetMapping("/api/user/me")
    public ResponseEntity<?> myAPI(@AuthenticationPrincipal UserPrincipal user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        dto.setEmail(user.getEmail());
        dto.setNickname(user.getNickname());

        return ResponseEntity.ok(dto);
    }
}
