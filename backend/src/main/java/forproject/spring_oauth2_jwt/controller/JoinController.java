package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.JoinDTO;
import forproject.spring_oauth2_jwt.service.JoinService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class JoinController {

    private final JoinService joinService;

    public JoinController(JoinService joinService) {
        this.joinService = joinService;
    }

    @PostMapping("/join")
    public String joinProcess(@RequestBody JoinDTO joinDTO) {
        log.info("username = " + joinDTO.getUsername());
        joinService.joinProcess(joinDTO);
        return "ok";
    }

}

