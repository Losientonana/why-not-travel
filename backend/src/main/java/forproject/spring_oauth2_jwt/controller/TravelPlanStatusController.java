package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.TravelPlanStatusResponse;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.service.TravelPlanStatusService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("api/trips")
public class TravelPlanStatusController {
    private final TravelPlanStatusService travelPlanStatusService;

    @GetMapping("{tripId}/status")
    public ResponseEntity<TravelPlanStatusResponse> getTravelPlanStatus(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
            ) {
        try {
            TravelPlanStatusResponse response = travelPlanStatusService
                    .getTravelPlanStatus(tripId, user.getId());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("여행 계획 상태 조회 실패: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/statuses")
    public ResponseEntity<List<TravelPlanStatusResponse>> getTravelPlanStatuses(
            @RequestBody List<Long> tripIds,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        List<TravelPlanStatusResponse> responses = travelPlanStatusService
                .getTravelPlanStatuses(user.getId(), tripIds);
        return ResponseEntity.ok(responses);
    }
}
