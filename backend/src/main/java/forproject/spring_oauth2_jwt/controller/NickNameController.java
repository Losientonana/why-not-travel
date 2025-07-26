//package forproject.spring_oauth2_jwt.controller;
//
//import forproject.spring_oauth2_jwt.dto.UserPrincipal;
//import forproject.spring_oauth2_jwt.service.UserService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequiredArgsConstructor
//@Slf4j
//public class NickNameController {
//
//    private final UserService userService;
//
//    @PatchMapping("/api/user/me") // PATCH 메서드로 변경
//    public ResponseEntity<?> updateMyInfo(
//            @AuthenticationPrincipal UserPrincipal user,
//            @RequestBody Map<String, String> req) {
//                        log.info("PATCH /api/user/me called by user: {}", user.getUsername());
//        String nickname = req.get("nickname");
//                        log.info("Received nickname: {}", nickname);
//
//        if (nickname == null || nickname.trim().isEmpty()) {
//                        log.warn("Nickname is null or empty.");
//            return ResponseEntity.badRequest().body("닉네임을 입력해주세요.");
//        }
//        try {
//            userService.updateNickname(user.getId(), nickname); // 서비스에서 DB에 반영
//                        log.info("Nickname updated successfully for user: {}", user.getUsername());
//            return ResponseEntity.ok("내 정보가 업데이트되었습니다.");
//        } catch (IllegalStateException e) {
//                        log.error("Nickname update failed for user {}: {}", user.getUsername(), e.getMessage());
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // 닉네임 중복 등
//        } catch (Exception e) {
//                        log.error("An unexpected error occurred during nickname update for user {}: {}", user.getUsername(), e.getMessage(), e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("알 수 없는 서버 오류가 발생했습니다.");
//        }
//    }
//
//    // /userinfo 엔드포인트는 /api/user/me (GET)과 중복되므로 제거
//    // 현재 MyController에 /api/user/me (GET)이 있으므로, 이 부분은 제거합니다.
//}
