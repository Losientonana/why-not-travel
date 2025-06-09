package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import forproject.spring_oauth2_jwt.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class NickNameController {

    private final UserRepository userRepository;
    private final UserService userService;

    public NickNameController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }


    @PostMapping("/nickname")
    public ResponseEntity<?> setNickname(
            Authentication authentication,
            @RequestBody Map<String, String> req) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        String nickname = req.get("nickname");
        if (nickname == null || nickname.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("닉네임을 입력해주세요.");
        }
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        userService.updateNickname(user.getId(), nickname); // 서비스에서 DB에 반영

        return ResponseEntity.ok("닉네임이 등록되었습니다.");
    }

}
