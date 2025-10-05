package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.ApiResponse;
import forproject.spring_oauth2_jwt.dto.TravelPlanCreateRequestDTO;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.service.TravelPlanService;
import forproject.spring_oauth2_jwt.dto.TravelPlanResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
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
    public ResponseEntity<ApiResponse<TravelPlanResponse>> create(
            @RequestBody @Valid TravelPlanCreateRequestDTO req,
            @AuthenticationPrincipal UserPrincipal user,
            BindingResult bindingResult
    ) {
        try {
            // 유효성 검사 실패 처리
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getAllErrors().get(0).getDefaultMessage();
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("VALIDATION_ERROR", errorMessage)
                );
            }

            log.info("여행 계획 생성 요청 - 사용자: {}, 제목: {}", user.getId(), req.getTitle());
            TravelPlanResponse result = travelPlanService.createTravelPlan(req, user.getId());

            return ResponseEntity.ok(
                    ApiResponse.success(result, "여행 계획이 성공적으로 생성되었습니다.")
            );

        } catch (IllegalArgumentException e) {
            log.warn("여행 계획 생성 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("INVALID_REQUEST", e.getMessage())
            );

        } catch (Exception e) {
            log.error("여행 계획 생성 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("INTERNAL_SERVER_ERROR", "서버 내부 오류가 발생했습니다.")
            );
        }
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
            @RequestBody TravelPlanCreateRequestDTO req,
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

