package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.ApiResponse;
import forproject.spring_oauth2_jwt.dto.UserDTO;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.dto.response.MyInfoResponse;
import forproject.spring_oauth2_jwt.service.MyInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MyController {

    private final MyInfoService myInfoService;
    /**
     *
     * @param user
     * 이름
     * 소개
     * 이메일
     * 가입일
     * 총여행
     * 프로필사진
     *
     * @return
     */
    @GetMapping("/api/user/me")
    public ResponseEntity<ApiResponse<MyInfoResponse>> myInfo(
            @AuthenticationPrincipal UserPrincipal user) {
        MyInfoResponse myInfoResponse= myInfoService.myInfo(user.getId());
        return ResponseEntity.ok(ApiResponse.success(myInfoResponse));
    }
}