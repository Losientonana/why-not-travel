package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.ApiResponse;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.dto.request.RejectSettlementRequest;
import forproject.spring_oauth2_jwt.dto.request.SettlementCompleteRequest;
import forproject.spring_oauth2_jwt.dto.response.BalanceSummaryResponse;
import forproject.spring_oauth2_jwt.dto.response.SettlementListResponse;
import forproject.spring_oauth2_jwt.dto.response.SettlementResponse;
import forproject.spring_oauth2_jwt.enums.SettlementStatus;
import forproject.spring_oauth2_jwt.service.SettlementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/trips/{tripId}/settlements")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;

    /**
     * 정산 요약 조회 (개별정산 집계 + 그리디 알고리즘)
     *
     * GET /api/trips/{tripId}/settlements/summary
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<BalanceSummaryResponse>> getBalanceSummary(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("정산 요약 조회 - tripId: {}, userId: {}", tripId, user.getId());
        BalanceSummaryResponse response = settlementService.getBalanceSummary(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 정산 생성 (채무자/채권자 플로우)
     *
     * POST /api/trips/{tripId}/settlements
     */
    @PostMapping
    public ResponseEntity<ApiResponse<SettlementResponse>> createSettlement(
            @PathVariable Long tripId,
            @RequestBody @Valid SettlementCompleteRequest request,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("정산 생성 - tripId: {}, userId: {}, request: {}", tripId, user.getId(), request);
        SettlementResponse response = settlementService.createSettlement(tripId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 정산 승인 (채권자만)
     *
     * PUT /api/trips/{tripId}/settlements/{settlementId}/approve
     */
    @PutMapping("/{settlementId}/approve")
    public ResponseEntity<ApiResponse<SettlementResponse>> approveSettlement(
            @PathVariable Long tripId,
            @PathVariable Long settlementId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("정산 승인 - tripId: {}, settlementId: {}, userId: {}", tripId, settlementId, user.getId());
        SettlementResponse response = settlementService.approveSettlement(tripId, settlementId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 정산 거절 (채권자만)
     *
     * PUT /api/trips/{tripId}/settlements/{settlementId}/reject
     */
    @PutMapping("/{settlementId}/reject")
    public ResponseEntity<ApiResponse<SettlementResponse>> rejectSettlement(
            @PathVariable Long tripId,
            @PathVariable Long settlementId,
            @RequestBody(required = false) RejectSettlementRequest request,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("정산 거절 - tripId: {}, settlementId: {}, userId: {}", tripId, settlementId, user.getId());
        String reason = request != null ? request.getReason() : null;
        SettlementResponse response = settlementService.rejectSettlement(tripId, settlementId, user.getId(), reason);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 정산 내역 조회 (필터링 가능)
     *
     * GET /api/trips/{tripId}/settlements?status={status}
     */
    @GetMapping
    public ResponseEntity<ApiResponse<SettlementListResponse>> getSettlements(
            @PathVariable Long tripId,
            @RequestParam(required = false) SettlementStatus status,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("정산 내역 조회 - tripId: {}, userId: {}, status: {}", tripId, user.getId(), status);
        SettlementListResponse response = settlementService.getSettlements(tripId, user.getId(), status);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

