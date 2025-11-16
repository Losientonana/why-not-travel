package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.*;
import forproject.spring_oauth2_jwt.dto.request.ActivityCreateRequest;
import forproject.spring_oauth2_jwt.dto.request.ActivityUpdateRequest;
import forproject.spring_oauth2_jwt.dto.request.ChecklistCreateRequestDTO;
import forproject.spring_oauth2_jwt.dto.request.ItineraryCreateRequestDTO;
import forproject.spring_oauth2_jwt.dto.response.*;
import forproject.spring_oauth2_jwt.entity.TravelActivity;
import forproject.spring_oauth2_jwt.service.TravelPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
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
        log.info("data = {}", req);
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
        log.info("show trip {}", user);
        List<TravelPlanResponse> result = travelPlanService.listMyPlans(user.getId());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{tripId}/detail")
    public ResponseEntity<TravelDetailResponse> getPlanDetail(@PathVariable Long tripId, @AuthenticationPrincipal UserPrincipal user) {
        log.info("GET /api/trips/{}/detail - userId: {}", tripId, user.getId());

        TravelDetailResponse response = travelPlanService.getTravelDetail(tripId, user.getId());
        log.info("response : {}", response);
        return ResponseEntity.ok(response);
    }

    /**
     * 옵션 B: 일정 조회 (일정 탭 클릭 시)
     * GET /api/trips/{tripId}/itineraries
     */
    @GetMapping("/{tripId}/itineraries")
    public ResponseEntity<List<ItineraryResponse>> getItineraries(@PathVariable Long tripId) {
        log.info("GET /api/trips/{}/itineraries", tripId);

        List<ItineraryResponse> itineraries = travelPlanService.getItineraries(tripId);
        return ResponseEntity.ok(itineraries);
    }


    /**
     * 옵션 B: 사진 조회 (사진 탭 클릭 시)
     * GET /api/trips/{tripId}/photos
     */
    @GetMapping("/{tripId}/photos")
    public ResponseEntity<List<PhotoResponse>> getPhotos(@PathVariable Long tripId) {
        log.info("GET /api/trips/{}/photos", tripId);

        List<PhotoResponse> photos = travelPlanService.getPhotos(tripId);
        return ResponseEntity.ok(photos);
    }

    /**
     * 옵션 B: 체크리스트 조회 (체크리스트 탭 클릭 시)
     * GET /api/trips/{tripId}/checklists
     */
    @GetMapping("/{tripId}/checklists")
    public ResponseEntity<List<ChecklistResponse>> getChecklists(@PathVariable Long tripId) {
        log.info("GET /api/trips/{}/checklists", tripId);

        List<ChecklistResponse> checklists = travelPlanService.getChecklists(tripId);
        return ResponseEntity.ok(checklists);
    }

    /**
     * 옵션 B: 경비 조회 (경비 탭 클릭 시)
     * GET /api/trips/{tripId}/expenses
     */
    @GetMapping("/{tripId}/expenses")
    public ResponseEntity<List<ExpenseResponse>> getExpenses(@PathVariable Long tripId) {
        log.info("GET /api/trips/{}/expenses", tripId);

        List<ExpenseResponse> expenses = travelPlanService.getExpenses(tripId);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping("/detail/checklists")
    public ResponseEntity<ApiResponse<ChecklistResponse>> createChecklist(
            @RequestBody @Valid ChecklistCreateRequestDTO request,
            @AuthenticationPrincipal UserPrincipal user
            ){
        ChecklistResponse response = travelPlanService.createChecklist(request, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("{id}/checklists")
    public ResponseEntity<ApiResponse<UpdateChecklistResponse>> updateChecklist(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal user) {
        UpdateChecklistResponse response = travelPlanService.toggleChecklist(id,user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }


    @DeleteMapping("{id}/checklists")
    public ResponseEntity<ApiResponse<DeleteChecklistResponse>> deleteChecklist(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal user){
        DeleteChecklistResponse response = travelPlanService.toggleDelete(id,user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }


    @PostMapping("/detail/itineraries")
    public ResponseEntity<ApiResponse<ItineraryCreateResponseDTO>> createItinerary(@RequestBody @Valid ItineraryCreateRequestDTO request, @AuthenticationPrincipal UserPrincipal user){
        ItineraryCreateResponseDTO response = travelPlanService.createItinerary(request,user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("{id}/itineraries")
    public ResponseEntity<ApiResponse<DeleteItineraryResponse>> deleteItineraries(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal user){
        DeleteItineraryResponse response = travelPlanService.deleteItineraries(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/detail/activities")
    public ResponseEntity<ApiResponse<ActivityResponse>> createActivities(@RequestBody @Valid ActivityCreateRequest request, @AuthenticationPrincipal UserPrincipal user){
        ActivityResponse response = travelPlanService.createActivities(request, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("{id}/activities")
    public ResponseEntity<ApiResponse<ActivityUpdateResponse>> updateActivities(@PathVariable Long id, @RequestBody @Valid ActivityUpdateRequest request, @AuthenticationPrincipal UserPrincipal user) {
        ActivityUpdateResponse response = travelPlanService.updateActivities(id, request,user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("{id}/activities")
    public ResponseEntity<ApiResponse<DeleteActivityResponse>> deleteActivities(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        DeleteActivityResponse response = travelPlanService.deleteActivities(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

}

