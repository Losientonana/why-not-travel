package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.ApiResponse;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.dto.request.SharedFundDepositRequest;
import forproject.spring_oauth2_jwt.dto.request.SharedFundExpenseRequest;
import forproject.spring_oauth2_jwt.dto.response.SharedFundResponse;
import forproject.spring_oauth2_jwt.dto.response.SharedFundTradeResponse;
import forproject.spring_oauth2_jwt.service.SharedFundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<SharedFundTradeResponse>> deposit(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user,
            @RequestBody @Valid SharedFundDepositRequest request
    ){
        log.info("공동 경비 입금 - tripId: {}, amountPerPerson: {}, userId: {}",
                tripId, request.getAmountPerPerson(), user.getId());
        SharedFundTradeResponse response = sharedFundService.deposit(tripId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/expense")
    public ResponseEntity<ApiResponse<SharedFundTradeResponse>> expense(
            @PathVariable Long tripId,
            @RequestBody @Valid SharedFundExpenseRequest request,
            @AuthenticationPrincipal UserPrincipal user
    ) throws Exception {
        log.info("공동 경비 지출 - tripId: {}, amount: {}, category: {}, userId: {}",
                tripId, request.getAmount(), request.getCategory(), user.getId());
        SharedFundTradeResponse response = sharedFundService.expense(tripId, request, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "지출이 완료되었습니다."));
    }
}
