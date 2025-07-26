package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.AvailabilityResponseDTO;
import forproject.spring_oauth2_jwt.dto.JoinDTO;
import forproject.spring_oauth2_jwt.service.JoinService;
import forproject.spring_oauth2_jwt.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class JoinController {

    private final JoinService joinService;
    private final UserService userService;

    @PostMapping("/api/join")
    public ResponseEntity<?> join(@RequestBody @Valid JoinDTO joinDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(errorMessage);
        }

        joinService.joinProcess(joinDTO);
        return ResponseEntity.ok("회원가입 성공");
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