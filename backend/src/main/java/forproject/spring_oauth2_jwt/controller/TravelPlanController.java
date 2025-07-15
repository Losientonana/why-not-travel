package forproject.spring_oauth2_jwt.controller;


import forproject.spring_oauth2_jwt.dto.TravelPlanCreateRequest;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.service.TravelPlanService;
import forproject.spring_oauth2_jwt.dto.TravelPlanResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/trips")
public class TravelPlanController {
    private final TravelPlanService travelPlanService;

    // 일정 생성 (로그인 사용자만)
    @PostMapping
    public ResponseEntity<TravelPlanResponse> create(
            @RequestBody @Valid TravelPlanCreateRequest req,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("create trip {}",req);
        TravelPlanResponse result = travelPlanService.createTravelPlan(req, user.getId());
        return ResponseEntity.ok(result);
    }

    // 내 일정 목록
    @GetMapping
    public ResponseEntity<List<TravelPlanResponse>> myPlans(
            @AuthenticationPrincipal UserPrincipal user) {
        log.info("show trip {}",user);
        List<TravelPlanResponse> result = travelPlanService.listMyPlans(user.getId());
        return ResponseEntity.ok(result);
    }

    // 특정 일정 조회
    @GetMapping("/{tripId}")
    public ResponseEntity<TravelPlanResponse> getPlan(@PathVariable Long tripId, @AuthenticationPrincipal UserPrincipal user) {
        TravelPlanResponse result = travelPlanService.getTravelPlan(tripId, user.getId());
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{tripId}")
    public ResponseEntity<TravelPlanResponse> update(
            @PathVariable Long tripId,
            @RequestBody TravelPlanCreateRequest req,
            @AuthenticationPrincipal UserPrincipal user
    ){
        TravelPlanResponse result = travelPlanService.updateTravelPlan(tripId,req,user.getId());
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long tripId, @AuthenticationPrincipal UserPrincipal user){
        travelPlanService.deleteTravelPlan(tripId, user.getId());
        return ResponseEntity.noContent().build();
    }


}

