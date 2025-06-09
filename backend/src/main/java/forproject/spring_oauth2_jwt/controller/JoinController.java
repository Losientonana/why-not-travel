package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.JoinDTO;
import forproject.spring_oauth2_jwt.service.JoinService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;
//
//@RestController
//@Slf4j
//public class JoinController {
//
//    private final JoinService joinService;
//
//    public JoinController(JoinService joinService) {
//        this.joinService = joinService;
//    }
//
//    @PostMapping("/join")
//    public String joinProcess(@RequestBody JoinDTO joinDTO) {
//        log.info("username = " + joinDTO.getUsername());
//        joinService.joinProcess(joinDTO);
//        return "ok";
//    }
//
//}


@RestController
@RequiredArgsConstructor
public class JoinController {

    private final JoinService joinService;

    @PostMapping("/join")
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
}
