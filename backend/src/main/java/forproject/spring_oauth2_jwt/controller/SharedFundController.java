package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.ApiResponse;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.dto.response.SharedFundResponse;
import forproject.spring_oauth2_jwt.dto.response.SharedFundTradeResponse;
import forproject.spring_oauth2_jwt.service.SharedFundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/trips/{tripId}/shared-fund")
@RequiredArgsConstructor
public class SharedFundController {
    private final SharedFundService sharedFundService;

    @GetMapping
    public ResponseEntity<ApiResponse<SharedFundResponse>> getSharedFund(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("공동 경비 조회 - tripId: {}, user: {}", tripId, user.getId());
        SharedFundResponse response = sharedFundService.getSharedFund(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/trade")
    public ResponseEntity<ApiResponse<List<SharedFundTradeResponse>>> getTradeList(
        @PathVariable Long tripId,
        @AuthenticationPrincipal UserPrincipal user
    ){
        log.info("거래 내역 조회 - tripId: {}, userId: {}", tripId, user.getId());
        List<SharedFundTradeResponse> response = sharedFundService.getTradeList(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
