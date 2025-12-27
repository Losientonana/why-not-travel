package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.*;
import forproject.spring_oauth2_jwt.dto.request.*;
import forproject.spring_oauth2_jwt.dto.response.*;
import forproject.spring_oauth2_jwt.dto.response.PhotoResponse;
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
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<List<ItineraryResponse>> getItineraries(@PathVariable Long tripId,@AuthenticationPrincipal UserPrincipal user ) {
        log.info("GET /api/trips/{}/itineraries", tripId);

        List<ItineraryResponse> itineraries = travelPlanService.getItineraries(tripId, user.getId());
        return ResponseEntity.ok(itineraries);
    }


//    /**
//     * 옵션 B: 사진 조회 (사진 탭 클릭 시)
//     * GET /api/trips/{tripId}/photos
//     */
//    @GetMapping("/{tripId}/photos")
//    public ResponseEntity<List<PhotoResponse>> getPhotos(@PathVariable Long tripId) {
//        log.info("GET /api/trips/{}/photos", tripId);
//
//        List<PhotoResponse> photos = travelPlanService.getPhotos(tripId);
//        return ResponseEntity.ok(photos);
//    }

    /**
     * 공용 체크리스트 조회
     * GET /api/trips/{tripId}/checklists/shared
     */
    @GetMapping("/{tripId}/checklists/shared")
    public ResponseEntity<ApiResponse<List<ChecklistResponse>>> getSharedChecklists(
            @PathVariable Long tripId
    ) {
        List<ChecklistResponse> checklists = travelPlanService.getSharedChecklists(tripId);
        return ResponseEntity.ok(ApiResponse.success(checklists));
    }

    /**
     * 개인 체크리스트 조회
     * GET /api/trips/{tripId}/checklists/personal
     */
    @GetMapping("/{tripId}/checklists/personal")
    public ResponseEntity<ApiResponse<List<ChecklistResponse>>> getPersonalChecklists(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        List<ChecklistResponse> checklists = travelPlanService.getPersonalChecklists(tripId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(checklists));
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

//    @PostMapping("/detail/checklists")
//    public ResponseEntity<ApiResponse<ChecklistResponse>> createChecklist(
//            @RequestBody @Valid ChecklistCreateRequestDTO request,
//            @AuthenticationPrincipal UserPrincipal user
//            ){
//        ChecklistResponse response = travelPlanService.createChecklist(request, user.getId());
//        return ResponseEntity.ok(ApiResponse.success(response));
//    }
    /**
     * 체크리스트 생성 (공용 또는 개인)
     * POST /api/trips/{tripId}/checklists
     */
    @PostMapping("/{tripId}/checklists")
    public ResponseEntity<ApiResponse<ChecklistResponse>> createChecklist(
            @PathVariable Long tripId,
            @RequestBody @Valid ChecklistCreateRequestDTO dto,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        ChecklistResponse response = travelPlanService.createChecklist(tripId, dto, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    /**
     * 체크리스트 토글 (완료/미완료)
     * PATCH /api/trips/{id}/checklists
     */
    @PatchMapping("/{id}/checklists")
    public ResponseEntity<ApiResponse<UpdateChecklistResponse>> updateChecklist(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        UpdateChecklistResponse response = travelPlanService.toggleChecklist(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 체크리스트 삭제
     * DELETE /api/trips/{id}/checklists
     */
    @DeleteMapping("/{id}/checklists")
    public ResponseEntity<ApiResponse<DeleteChecklistResponse>> deleteChecklist(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        DeleteChecklistResponse response = travelPlanService.toggleDelete(id, user.getId());
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


    // ============================================
// 앨범(버킷) 관련 API
// ============================================

    /**
     * 앨범 생성
     * POST /api/trips/{tripId}/albums
     *
     * 요청:
     * {
     *   "albumTitle": "제주도 첫째날",
     *   "albumDate": "2024-03-15",
     *   "displayOrder": 1
     * }
     *
     * 응답:
     * {
     *   "success": true,
     *   "data": {
     *     "id": 1,
     *     "tripId": 1,
     *     "albumTitle": "제주도 첫째날",
     *     "albumDate": "2024-03-15",
     *     "createdAt": "2024-11-26T14:30:00"
     *   }
     * }
     */
    @PostMapping("/{tripId}/albums")
    public ResponseEntity<ApiResponse<AlbumResponse>> createAlbum(
            @PathVariable Long tripId,
            @RequestBody @Valid AlbumCreateRequest request,
            @AuthenticationPrincipal UserPrincipal user,
            BindingResult bindingResult
    ) {
        log.info("POST /api/trips/{}/albums - userId: {}, title: {}",
                tripId, user.getId(), request.getAlbumTitle());

        try {
            // 유효성 검사
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getAllErrors().get(0).getDefaultMessage();
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("VALIDATION_ERROR", errorMessage)
                );
            }

            AlbumResponse response = travelPlanService.createAlbum(tripId, request, user.getId());

            return ResponseEntity.ok(
                    ApiResponse.success(response, "앨범이 성공적으로 생성되었습니다.")
            );

        } catch (RuntimeException e) {
            log.error("앨범 생성 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("CREATE_FAILED", e.getMessage())
            );
        } catch (Exception e) {
            log.error("앨범 생성 중 서버 오류: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("INTERNAL_ERROR", "서버 오류가 발생했습니다.")
            );
        }
    }

    /**
     * 앨범에 사진 업로드
     * POST /api/trips/{tripId}/albums/{albumId}/photos
     *
     * 요청:
     * Content-Type: multipart/form-data
     * - image: [파일]
     *
     * 응답:
     * {
     *   "success": true,
     *   "data": {
     *     "id": 1,
     *     "albumId": 1,
     *     "imageUrl": "http://localhost:9000/.../original/uuid.jpg",
     *     "thumbnailUrl": "http://localhost:9000/.../thumbnail/uuid.jpg",
     *     "userId": 1,
     *     "userName": "김여행",
     *     "likesCount": 0,
     *     "createdAt": "2024-11-26T14:35:00"
     *   },
     *   "message": "사진이 성공적으로 업로드되었습니다."
     * }
     */
    @PostMapping("/{tripId}/albums/{albumId}/photos")
    public ResponseEntity<ApiResponse<PhotoResponse>> uploadPhotoToAlbum(
            @PathVariable Long tripId,
            @PathVariable Long albumId,
            @RequestParam("image") MultipartFile image,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("POST /api/trips/{}/albums/{}/photos - userId: {}",
                tripId, albumId, user.getId());

        try {
            // 파일 존재 확인
            if (image == null || image.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("INVALID_FILE", "업로드할 이미지가 없습니다.")
                );
            }

            PhotoResponse response = travelPlanService.uploadPhotoToAlbum(
                    tripId, albumId, image, user.getId()
            );

            return ResponseEntity.ok(
                    ApiResponse.success(response, "사진이 성공적으로 업로드되었습니다.")
            );

        } catch (RuntimeException e) {
            log.error("사진 업로드 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("UPLOAD_FAILED", e.getMessage())
            );
        } catch (Exception e) {
            log.error("사진 업로드 중 서버 오류: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("INTERNAL_ERROR", "서버 오류가 발생했습니다.")
            );
        }
    }

    /**
     * 앨범 목록 조회 (사진 포함)
     * GET /api/trips/{tripId}/albums
     *
     * 응답:
     * {
     *   "success": true,
     *   "data": [
     *     {
     *       "id": 1,
     *       "albumTitle": "제주도 첫째날",
     *       "albumDate": "2024-03-15",
     *       "photoCount": 5,
     *       "photos": [
     *         {
     *           "id": 1,
     *           "imageUrl": "...",
     *           "thumbnailUrl": "...",
     *           "userId": 1,
     *           "userName": "김여행"
     *         }
     *       ]
     *     }
     *   ]
     * }
     */
    @GetMapping("/{tripId}/albums")
    public ResponseEntity<ApiResponse<List<AlbumResponse>>> getAlbums(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("GET /api/trips/{}/albums - userId: {}", tripId, user.getId());

        try {
            List<AlbumResponse> albums = travelPlanService.getAlbumsWithPhotos(
                    tripId,
                    user.getId()
            );

            return ResponseEntity.ok(
                    ApiResponse.success(albums, "앨범 목록 조회 성공")
            );

        } catch (RuntimeException e) {
            log.error("앨범 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("FETCH_FAILED", e.getMessage())
            );
        } catch (Exception e) {
            log.error("앨범 목록 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("INTERNAL_ERROR", "앨범 목록 조회에 실패했습니다.")
            );
        }
    }

    /**
     * 특정 앨범의 사진 목록 조회
     * GET /api/trips/{tripId}/albums/{albumId}/photos
     *
     * 응답:
     * {
     *   "success": true,
     *   "data": [
     *     {
     *       "id": 1,
     *       "albumId": 1,
     *       "imageUrl": "http://localhost:9000/.../original/uuid.jpg",
     *       "thumbnailUrl": "http://localhost:9000/.../thumbnail/uuid.jpg",
     *       "userId": 1,
     *       "userName": "김여행",
     *       "likesCount": 0
     *     }
     *   ]
     * }
     */
    @GetMapping("/{tripId}/albums/{albumId}/photos")
    public ResponseEntity<ApiResponse<List<PhotoResponse>>> getPhotosByAlbum(
            @PathVariable Long tripId,
            @PathVariable Long albumId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("GET /api/trips/{}/albums/{}/photos - userId: {}",
                tripId, albumId, user.getId());

        try {
            List<PhotoResponse> photos = travelPlanService.getPhotosByAlbum(
                    albumId,
                    user.getId()
            );

            return ResponseEntity.ok(
                    ApiResponse.success(photos, "사진 목록 조회 성공")
            );

        } catch (RuntimeException e) {
            log.error("사진 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("FETCH_FAILED", e.getMessage())
            );
        } catch (Exception e) {
            log.error("사진 목록 조회 중 서버 오류: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("INTERNAL_ERROR", "서버 오류가 발생했습니다.")
            );
        }
    }

    /**
     * 앨범 삭제
     * DELETE /api/trips/{tripId}/albums/{albumId}
     *
     * 동작:
     * - 앨범 내 모든 사진 삭제 (DB)
     * - 앨범 삭제
     *
     * 응답:
     * {
     *   "success": true,
     *   "message": "앨범이 성공적으로 삭제되었습니다."
     * }
     */
    @DeleteMapping("/{tripId}/albums/{albumId}")
    public ResponseEntity<ApiResponse<Void>> deleteAlbum(
            @PathVariable Long tripId,
            @PathVariable Long albumId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("DELETE /api/trips/{}/albums/{} - userId: {}",
                tripId, albumId, user.getId());

        try {
            travelPlanService.deleteAlbum(tripId, albumId, user.getId());

            return ResponseEntity.ok(
                    ApiResponse.success(null, "앨범이 성공적으로 삭제되었습니다.")
            );

        } catch (RuntimeException e) {
            log.error("앨범 삭제 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("DELETE_FAILED", e.getMessage())
            );
        } catch (Exception e) {
            log.error("앨범 삭제 중 서버 오류: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("INTERNAL_ERROR", "서버 오류가 발생했습니다.")
            );
        }
    }

    /**
     * 사진 삭제
     * DELETE /api/trips/{tripId}/photos/{photoId}
     *
     * 권한: 본인이 업로드한 사진만 삭제 가능
     *
     * 응답:
     * {
     *   "success": true,
     *   "message": "사진이 성공적으로 삭제되었습니다."
     * }
     */
    @DeleteMapping("/{tripId}/photos/{photoId}")
    public ResponseEntity<ApiResponse<Void>> deletePhoto(
            @PathVariable Long tripId,
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("DELETE /api/trips/{}/photos/{} - userId: {}",
                tripId, photoId, user.getId());

        try {
            travelPlanService.deletePhoto(tripId, photoId, user.getId());

            return ResponseEntity.ok(
                    ApiResponse.success(null, "사진이 성공적으로 삭제되었습니다.")
            );

        } catch (RuntimeException e) {
            log.error("사진 삭제 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("DELETE_FAILED", e.getMessage())
            );
        } catch (Exception e) {
            log.error("사진 삭제 중 서버 오류: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("INTERNAL_ERROR", "서버 오류가 발생했습니다.")
            );
        }
    }


}

