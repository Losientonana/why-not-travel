package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.ApiResponse;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.dto.response.TravelOverviewResponse;
import forproject.spring_oauth2_jwt.service.TravelOverviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trips")
@Slf4j
@RequiredArgsConstructor
public class TravelOverviewController {
    private final TravelOverviewService travelOverViewService;

    @GetMapping("/{tripId}/overview")
    public ResponseEntity<ApiResponse<TravelOverviewResponse>> getTravelOverView(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
            ){
        log.info("📊 여행 개요 조회 요청 - tripId: {}, userId: {}", tripId, user.getId());
        TravelOverviewResponse response = travelOverViewService.getTravelOverview(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
