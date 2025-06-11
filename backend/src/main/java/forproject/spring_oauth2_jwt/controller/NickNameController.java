package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.jwt.JWTUtil;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import forproject.spring_oauth2_jwt.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class NickNameController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final JWTUtil jwtUtil;

    public NickNameController(UserRepository userRepository, UserService userService, JWTUtil jwtUtil) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
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

    @GetMapping("/userinfo")
    public ResponseEntity<?> getUserInfo(HttpServletRequest request) {
        String accessToken = request.getHeader("access");
        if (accessToken == null || jwtUtil.isExpired(accessToken)) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("토큰 없음 또는 만료");
        }

        String username = jwtUtil.getUsername(accessToken);
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("유저 없음");
        }

        Map<String, String> result = new HashMap<>();
        result.put("username", username);
        result.put("nickname", user.getNickname());
        return ResponseEntity.ok(result);
    }
}
