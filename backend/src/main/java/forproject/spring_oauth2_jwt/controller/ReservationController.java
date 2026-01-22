package forproject.spring_oauth2_jwt.controller;


import forproject.spring_oauth2_jwt.dto.ApiResponse;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.dto.request.ReservationCreateRequest;
import forproject.spring_oauth2_jwt.dto.request.ReservationUpdateRequest;
import forproject.spring_oauth2_jwt.dto.response.ReservationResponse;
import forproject.spring_oauth2_jwt.enums.ReservationType;
import forproject.spring_oauth2_jwt.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/reservations")
@RequiredArgsConstructor
@Slf4j
public class ReservationController {

    private final ReservationService reservationService;

    /**
     * 예약 등록
     * POST /api/trips/{tripId}/reservations
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user,
            @RequestBody @Valid ReservationCreateRequest request
    ) {
        log.info("예약 등록 요청 - tripId: {}, userId: {}, type: {}", tripId, user.getId(), request.getType());
        ReservationResponse response = reservationService.createReservation(tripId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "예약이 등록되었습니다"));
    }

    /**
     * 전체 예약 조회
     * GET /api/trips/{tripId}/reservations
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getAllReservations(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("전체 예약 조회 - tripId: {}, userId: {}", tripId, user.getId());
        List<ReservationResponse> response = reservationService.getAllReservations(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 타입별 예약 조회
     * GET /api/trips/{tripId}/reservations?type=FLIGHT
     */
    @GetMapping(params = "type")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getReservationsByType(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam ReservationType type
    ) {
        log.info("타입별 예약 조회 - tripId: {}, userId: {}, type: {}", tripId, user.getId(), type);
        List<ReservationResponse> response = reservationService.getReservationsByType(tripId, user.getId(), type);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 단일 예약 조회
     * GET /api/trips/{tripId}/reservations/{reservationId}
     */
    @GetMapping("/{reservationId}")
    public ResponseEntity<ApiResponse<ReservationResponse>> getReservation(
            @PathVariable Long tripId,
            @PathVariable Long reservationId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("단일 예약 조회 - tripId: {}, userId: {}, reservationId: {}", tripId, user.getId(), reservationId);
        ReservationResponse response = reservationService.getReservation(tripId, user.getId(), reservationId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 예약 수정
     * PUT /api/trips/{tripId}/reservations/{reservationId}
     */
    @PutMapping("/{reservationId}")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateReservation(
            @PathVariable Long tripId,
            @PathVariable Long reservationId,
            @AuthenticationPrincipal UserPrincipal user,
            @RequestBody @Valid ReservationUpdateRequest request
    ) {
        log.info("예약 수정 요청 - tripId: {}, userId: {}, reservationId: {}", tripId, user.getId(), reservationId);
        ReservationResponse response = reservationService.updateReservation(tripId, user.getId(), reservationId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "예약이 수정되었습니다"));
    }

    /**
     * 예약 삭제
     * DELETE /api/trips/{tripId}/reservations/{reservationId}
     */
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<ApiResponse<Void>> deleteReservation(
            @PathVariable Long tripId,
            @PathVariable Long reservationId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("예약 삭제 요청 - tripId: {}, userId: {}, reservationId: {}", tripId, user.getId(), reservationId);
        reservationService.deleteReservation(tripId, user.getId(), reservationId);
        return ResponseEntity.ok(ApiResponse.success(null, "예약이 삭제되었습니다"));
    }

    /**
     * 예약 현황 요약
     * GET /api/trips/{tripId}/reservations/summary
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<ReservationService.ReservationSummaryResponse>> getReservationSummary(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("예약 현황 요약 - tripId: {}, userId: {}", tripId, user.getId());
        ReservationService.ReservationSummaryResponse response = reservationService.getReservationSummary(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}