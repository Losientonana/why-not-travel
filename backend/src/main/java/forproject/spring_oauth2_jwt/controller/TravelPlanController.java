package forproject.spring_oauth2_jwt.controller;


import forproject.spring_oauth2_jwt.dto.TravelPlanCreateRequest;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.service.TravelPlanService;
import forproject.spring_oauth2_jwt.dto.TravelPlanResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/trips")
public class TravelPlanController {
    private final TravelPlanService travelPlanService;

    // 일정 생성 (로그인 사용자만)
    @PostMapping
    public ResponseEntity<TravelPlanResponse> create(
            @RequestBody TravelPlanCreateRequest req,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        TravelPlanResponse result = travelPlanService.createTravelPlan(req, user.getId());
        return ResponseEntity.ok(result);
    }

    // 내 일정 목록
    @GetMapping
    public ResponseEntity<List<TravelPlanResponse>> myPlans(@AuthenticationPrincipal UserPrincipal user) {
        List<TravelPlanResponse> result = travelPlanService.listMyPlans(user.getId());
        return ResponseEntity.ok(result);
    }
}

