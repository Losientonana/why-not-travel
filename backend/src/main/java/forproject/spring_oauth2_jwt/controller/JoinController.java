package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.ApiResponse;
import forproject.spring_oauth2_jwt.dto.AvailabilityResponseDTO;
import forproject.spring_oauth2_jwt.dto.JoinDTO;
import forproject.spring_oauth2_jwt.service.JoinService;
import forproject.spring_oauth2_jwt.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
public class JoinController {

    private final JoinService joinService;
    private final UserService userService;

    @PostMapping("/api/join")
    public ResponseEntity<ApiResponse<?>> join(@RequestBody @Valid JoinDTO joinDTO, BindingResult bindingResult) {
        log.info("📝 회원가입 요청 받음 - 이메일: {}", joinDTO.getEmail());

        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.joining(", "));
            log.error("❌ 유효성 검증 실패: {}", errorMessage);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("VALIDATION_ERROR", errorMessage));
        }

        try {
            joinService.joinProcess(joinDTO);

            // 성공 응답 데이터 생성
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("email", joinDTO.getEmail());
            responseData.put("message", "회원가입이 완료되었습니다. 이메일을 확인해주세요.");
            responseData.put("requiresVerification", true);

            log.info("✅ 회원가입 성공 - 이메일: {}", joinDTO.getEmail());
            return ResponseEntity.ok(ApiResponse.success(responseData));

//        } catch (MessagingException e) {
//            log.error("❌ 이메일 발송 실패: {}", e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(ApiResponse.error("EMAIL_SEND_ERROR", "이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요."));

        } catch (IllegalStateException e) {
            log.error("❌ 회원가입 실패 - 중복: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("DUPLICATE_ERROR", e.getMessage()));

        } catch (Exception e) {
            log.error("❌ 회원가입 실패 - 예외: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("SIGNUP_ERROR", "회원가입 중 오류가 발생했습니다."));
        }
    }

//    @GetMapping("/api/check-nickname")
//    public ResponseEntity<AvailabilityResponseDTO> checkNickname(
//            @RequestParam("nickname") String nickname){
//        if (nickname == null || nickname.trim().isEmpty()) {
//            return ResponseEntity.badRequest().body(new AvailabilityResponseDTO(false));
//        }
//        boolean isAvailable = userService.isNickNameAvailable(nickname);
//        return ResponseEntity.ok(new AvailabilityResponseDTO(isAvailable));
//    }
    @GetMapping("/api/auth/check-email")
   public ResponseEntity<AvailabilityResponseDTO> checkEmail(
            @RequestParam("email") String email) {
             if (email == null || email.trim().isEmpty()) {
                         return ResponseEntity.badRequest().body(new AvailabilityResponseDTO(
                    false));
                   }
                boolean isAvailable = userService.isEmailAvailable(email);
              return ResponseEntity.ok(new AvailabilityResponseDTO(isAvailable));
           }
}