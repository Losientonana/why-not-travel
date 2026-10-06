package forproject.spring_oauth2_jwt.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import forproject.spring_oauth2_jwt.dto.*;
import forproject.spring_oauth2_jwt.dto.request.*;
import forproject.spring_oauth2_jwt.dto.response.*;
import forproject.spring_oauth2_jwt.entity.*;
import forproject.spring_oauth2_jwt.enums.BudgetLevel;
import forproject.spring_oauth2_jwt.enums.TravelStyle;
import forproject.spring_oauth2_jwt.exception.ForbiddenException;
import forproject.spring_oauth2_jwt.exception.ResourceNotFoundException;
import forproject.spring_oauth2_jwt.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelPlanService {
    private final TravelPlanRepository travelPlanRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final TravelParticipantRepository travelParticipantRepository;
    private final TravelItineraryRepository itineraryRepository;
    private final TravelActivityRepository activityRepository;
    private final TravelPhotoRepository photoRepository;
    private final TravelChecklistRepository checklistRepository;
    private final TravelExpenseRepository expenseRepository;
    private final TravelParticipantRepository participantRepository;
    private final TravelItineraryRepository travelItineraryRepository;
    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private ImageUploadService imageUploadService;
    private final PhotoAlbumRepository photoAlbumRepository;
    private final TravelInvitationRepository travelInvitationRepository;
    private final TravelInvitationService travelInvitationService;



    // 일정 생성
    @Transactional
    public TravelPlanResponse createTravelPlan(TravelPlanCreateRequestDTO req, Long userId) {
        try {
            log.info("여행 계획 생성 시작: userId={}, title={}, destination={}",
                    userId, req.getTitle(), req.getDestination());

            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> {
                        log.warn("여행 계획 생성 실패 - 사용자 없음: userId={}", userId);
                        return new ResourceNotFoundException(
                                "사용자를 찾을 수 없습니다",
                                "User not found: userId=" + userId
                        );
                    });

            // 태그를 JSON으로 변환
            String tagsJson = null;
            if (req.getTags() != null && !req.getTags().isEmpty()) {
                tagsJson = objectMapper.writeValueAsString(req.getTags());
            }

            // Enum 변환
            TravelStyle travelStyle = null;
            if (req.getTravelStyle() != null) {
                try {
                    travelStyle = TravelStyle.valueOf(req.getTravelStyle());
                } catch (IllegalArgumentException e) {
                    log.warn("잘못된 여행 스타일: {}", req.getTravelStyle());
                }
            }

            BudgetLevel budgetLevel = null;
            if (req.getBudgetLevel() != null) {
                try {
                    budgetLevel = BudgetLevel.valueOf(req.getBudgetLevel());
                } catch (IllegalArgumentException e) {
                    log.warn("잘못된 예산 수준: {}", req.getBudgetLevel());
                }
            }

            TravelPlanEntity entity = TravelPlanEntity.builder()
                    .title(req.getTitle())
                    .startDate(req.getStartDate())
                    .endDate(req.getEndDate())
                    .description(req.getDescription())
                    .destination(req.getDestination())
                    .imageUrl(req.getImageUri())
                    .estimatedCost(req.getEstimatedCost())
                    .tags(tagsJson)
                    .travelStyle(travelStyle)
                    .budgetLevel(budgetLevel)
                    .user(user)
                    .visibility(req.getVisibility() != null ? req.getVisibility() : "PUBLIC")
                    .build();

            TravelPlanEntity saved = travelPlanRepository.save(entity);


            TravelParticipant participant = TravelParticipant.builder()
                    .tripId(saved.getId())
                    .userId(saved.getUser().getId())
                    .build();

            travelParticipantRepository.save(participant);

            if (req.getInviteEmails() != null && !req.getInviteEmails().isEmpty()) {
                log.info("📧 초대 이메일 발송 시작 - 수: {}", req.getInviteEmails().size());

                travelInvitationService.createInvitations(
                        saved.getId(),
                        userId,
                        req.getInviteEmails()
                );

//                if(1 == 1){
//                throw new RuntimeException("ss");
//                };

                log.info("✅ 초대 처리 완료");
            }


            TravelPlanResponse resp = new TravelPlanResponse();
            resp.setId(saved.getId());
            resp.setTitle(saved.getTitle());
            resp.setStartDate(saved.getStartDate());
            resp.setEndDate(saved.getEndDate());
            resp.setDescription(saved.getDescription());
            resp.setName(user.getName());
            resp.setVisibility(saved.getVisibility());

            log.info("✓ 여행 계획 생성 완료: tripId={}, userId={}", saved.getId(), userId);
            return resp;

        } catch (JsonProcessingException e) {
            log.error("여행 계획 생성 실패 - JSON 변환 오류: userId={}, tags={}", userId, req.getTags(), e);
            throw new RuntimeException("여행 계획 생성 중 오류가 발생했습니다.", e);
        }
    }

    // 내 일정 전체 조회
    @Transactional(readOnly = true)  // readOnly 추가 (성능 최적화)
    public List<TravelPlanResponse> listMyPlans(Long userId) {
        // 변경: findByOwnerOrParticipant 사용
        List<TravelPlanEntity> plans = travelPlanRepository.findByOwnerOrParticipant(userId);

        List<TravelPlanResponse> result = plans.stream().map(plan -> {
            TravelPlanResponse resp = new TravelPlanResponse();
            resp.setId(plan.getId());
            resp.setTitle(plan.getTitle());
            resp.setStartDate(plan.getStartDate());
            resp.setEndDate(plan.getEndDate());
            resp.setDescription(plan.getDescription());
            resp.setName(plan.getUser().getName());  // OWNER 이름
            resp.setVisibility(plan.getVisibility());
            resp.setDestination(plan.getDestination());
            resp.setImageUrl(plan.getImageUrl());
            return resp;
        }).collect(Collectors.toList());

        return result;
    }

    @Transactional(readOnly = true)
    public TravelPlanResponse getTravelPlan(Long tripId, Long userId) {
        log.info("여행 계획 조회: tripId={}, userId={}", tripId, userId);

        TravelPlanEntity plan = travelPlanRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> {
                    log.warn("여행 계획 조회 실패 - 존재하지 않음: tripId={}, userId={}", tripId, userId);
                    return new ResourceNotFoundException(
                            "요청한 여행 계획을 찾을 수 없습니다",
                            String.format("TravelPlan not found or deleted: tripId=%d, userId=%d", tripId, userId)
                    );
                });

        // 변경: OWNER이거나 PARTICIPANT인지 확인
        boolean isOwner = plan.getUser().getId().equals(userId);
        boolean isParticipant = travelParticipantRepository.existsByTripIdAndUserId(tripId, userId);

        if (!isOwner && !isParticipant) {
            log.warn("여행 계획 조회 실패 - 권한 없음: tripId={}, ownerId={}, requesterId={}",
                    tripId, plan.getUser().getId(), userId);
            throw new ForbiddenException(
                    "이 여행 계획을 조회할 권한이 없습니다",
                    String.format("Access denied: tripId=%d, ownerId=%d, requesterId=%d",
                            tripId, plan.getUser().getId(), userId)
            );
        }

        TravelPlanResponse resp = new TravelPlanResponse();
        resp.setId(plan.getId());
        resp.setTitle(plan.getTitle());
        resp.setStartDate(plan.getStartDate());
        resp.setEndDate(plan.getEndDate());
        resp.setDescription(plan.getDescription());
        resp.setName(plan.getUser().getName());
        resp.setVisibility(plan.getVisibility());
        resp.setDestination(plan.getDestination());
        resp.setImageUrl(plan.getImageUrl());

        return resp;
    }


    @Transactional
    public TravelPlanResponse updateTravelPlan(Long tripId, TravelPlanCreateRequestDTO req, Long userId) {
        log.info("여행 계획 수정 시작: tripId={}, userId={}", tripId, userId);

        TravelPlanEntity travelPlanEntity = travelPlanRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> {
                    log.warn("여행 계획 수정 실패 - 존재하지 않음: tripId={}", tripId);
                    return new ResourceNotFoundException(
                            "요청한 여행 계획을 찾을 수 없습니다",
                            "TravelPlan not found for update: tripId=" + tripId
                    );
                });

        if (!travelPlanEntity.getUser().getId().equals(userId)) {
            log.warn("여행 계획 수정 실패 - 권한 없음: tripId={}, ownerId={}, requesterId={}",
                    tripId, travelPlanEntity.getUser().getId(), userId);
            throw new ForbiddenException(
                    "이 여행 계획을 수정할 권한이 없습니다",
                    String.format("Update access denied: tripId=%d, ownerId=%d, requesterId=%d",
                            tripId, travelPlanEntity.getUser().getId(), userId)
            );
        }
        travelPlanEntity.setTitle(req.getTitle());
        travelPlanEntity.setStartDate(req.getStartDate());
        travelPlanEntity.setEndDate(req.getEndDate());
        travelPlanEntity.setDescription(req.getDescription());
        travelPlanEntity.setVisibility(req.getVisibility());

        TravelPlanEntity save = travelPlanRepository.save(travelPlanEntity);

        TravelPlanResponse travelPlanResponse = new TravelPlanResponse();
        travelPlanResponse.setTitle(save.getTitle());
        travelPlanResponse.setStartDate(save.getStartDate());
        travelPlanResponse.setEndDate(save.getEndDate());
        travelPlanResponse.setDescription(save.getDescription());
        travelPlanResponse.setVisibility(save.getVisibility());

        return travelPlanResponse;
    }

    @Transactional
    public void deleteTravelPlan(Long tripId, Long userId) {
        log.info("여행 계획 삭제 시도: tripId={}, userId={}", tripId, userId);

        // 1. 여행 일정 조회 또는 예외 발생
        TravelPlanEntity travelPlanEntity = travelPlanRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> {
                    log.warn("여행 계획 삭제 실패 - 존재하지 않음: tripId={}", tripId);
                    return new ResourceNotFoundException(
                            "요청한 여행 계획을 찾을 수 없습니다",
                            "TravelPlan not found for deletion: tripId=" + tripId
                    );
                });

        // 2. 소유권 확인 (ID가 다를 경우 예외 발생)
        if (!travelPlanEntity.getUser().getId().equals(userId)) {
            log.warn("여행 계획 삭제 실패 - 권한 없음: tripId={}, ownerId={}, requesterId={}",
                    tripId, travelPlanEntity.getUser().getId(), userId);
            throw new ForbiddenException(
                    "이 여행을 삭제할 권한이 없습니다",
                    String.format("Delete access denied: tripId=%d, ownerId=%d, requesterId=%d",
                            tripId, travelPlanEntity.getUser().getId(), userId)
            );
        }

        // 3. 논리적 삭제 (isDeleted 플래그를 true로 변경)
        travelPlanEntity.setDeleted(true);
        log.info("✓ 여행 계획 삭제 완료: tripId={}, userId={}", tripId, userId);
        // @Transactional 어노테이션에 의해 메소드 종료 시 자동으로 DB에 반영됩니다.
    }

    /**
     * 여행 상세 정보 조회 (옵션A)
     * @param tripId
     * @param userId
     * @return
     */
    @Transactional(readOnly = true)
    public TravelDetailResponse getTravelDetail(Long tripId, Long userId) {

        log.info("travelDetail2 - tripId: {}, userId: {}", tripId, userId);

        // 여행의 기본 정보 조회
        TravelPlanEntity trip = travelPlanRepository.findById(tripId)
                .orElseThrow(() -> {
                    log.warn("여행 상세 조회 실패 - 존재하지 않음: tripId={}", tripId);
                    return new ResourceNotFoundException(
                            "요청한 여행을 찾을 수 없습니다",
                            "TravelPlan not found: tripId=" + tripId
                    );
                });

        // 참여자 조회
        List<TravelParticipant> participants = travelParticipantRepository.findByTripIdOrderByJoinedAt(tripId);
        List<ParticipantDTO> participantDTOS = toParticipantDtos(participants);

        // 통계 계산
        TravelStatisticsDTO statisticsDTO = calculateStatistics(tripId, trip.getEstimatedCost());

        // 현재 사용자 권한 확인
        String currentUserRole = getCurrentUserRole(tripId, userId);
        boolean isOwner = "OWNER".equals(currentUserRole) || trip.getUser().getId().equals(userId);

        // 상태 계산

        return TravelDetailResponse.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .description(trip.getDescription())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .imageUrl(trip.getImageUrl())
                .estimatedCost(trip.getEstimatedCost())
                .visibility(trip.getVisibility())
                .participants(participantDTOS)
                .statistics(statisticsDTO)
                .status("계획중")
                .statusDescription("계획중")
                .currentUserRole(currentUserRole)
                .isOwner(isOwner)
                .build();
}

    /**
     * 참여자 DTO로 변환
     */
    private List<ParticipantDTO> toParticipantDtos(List<TravelParticipant> participants) {
        // userId 목록 추출
        List<Long> userIds = participants.stream()
                .map(TravelParticipant::getUserId)
                .collect(Collectors.toList());

        // 사용자 정보 한 번에 조회 (N+1 방지)
        List<UserEntity> users = userRepository.findAllById(userIds);
        Map<Long, UserEntity> userMap = users.stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));

        return participants.stream()
                .map(participant -> {
                    UserEntity user = userMap.get(participant.getUserId());
                    return ParticipantDTO.fromEntity(participant, user);
                })
                .collect(Collectors.toList());
    }

    /**
     * 통계 계산(COUNT,SUM)
     */
    private TravelStatisticsDTO calculateStatistics(Long tripId, Long estimatedBudget) {
        // COUNT 쿼리들
        int itineraryCount = itineraryRepository.countByTripId(tripId);
        int photoCount = photoRepository.countByTripId(tripId);
        int totalChecklistCount = checklistRepository.countByTripId(tripId);
        int completedChecklistCount = checklistRepository.countByTripIdAndCompletedTrue(tripId);

        // SUM 쿼리
        BigDecimal totalExpenses = expenseRepository.sumAmountByTripId(tripId);

        // Long으로 변환
        long totalExpensesLong = totalExpenses != null ? totalExpenses.longValue() : 0L;
        long estimatedBudgetLong = estimatedBudget != null ? estimatedBudget : 0L;

        // 예산 사용률 계산
        double budgetUsagePercentage = estimatedBudgetLong > 0
                ? (totalExpensesLong * 100.0 / estimatedBudgetLong)
                : 0.0;

        return TravelStatisticsDTO.builder()
                .itineraryCount(itineraryCount)
                .photoCount(photoCount)
                .completedChecklistCount(completedChecklistCount)
                .totalChecklistCount(totalChecklistCount)
                .totalExpenses(totalExpenses)
                .estimatedBudget(estimatedBudget)
                .budgetUsagePercentage(budgetUsagePercentage)
                .build();
    }

    /**
     * 현재 사용자의 역할 조회
     */
    private String getCurrentUserRole(Long tripId, Long userId) {
        return travelParticipantRepository.findByTripIdAndUserId(tripId, userId)
                .map(TravelParticipant::getRole)
                .orElse(null);
    }

    /**
     * 일정 조회(옵션 B: 일정 탭 클릭)
     */
    @Transactional(readOnly = true)
    public List<ItineraryResponse> getItineraries(Long tripId,Long user) {

        Optional<TravelParticipant> participantOpt =
                travelParticipantRepository.findByTripIdAndUserId(tripId, user);

        if (participantOpt.isEmpty()) {
            log.warn("일정 조회 실패 - 참여자 아님: tripId={}, userId={}", tripId, user);
            throw new ForbiddenException(
                    "여행 참여자만 일정을 조회할 수 있습니다",
                    String.format("Not a participant: tripId=%d, userId=%d", tripId, user)
            );
        }
        // 일정 조회
        List<TravelItinerary> itineraries = itineraryRepository.findByTripIdOrderByDayNumber(tripId);
        List<Long> itineraryIds = itineraries.stream()
                .map(TravelItinerary::getId)
                .collect(Collectors.toList());

        log.info("List<TravelItinerary> itineraries = {}",itineraries);
        log.info("List<Long> itineraryIds = {}",itineraryIds);


        List<TravelActivity> activities = activityRepository
                .findByItineraryIdInOrderByDisplayOrderAscTimeAsc(itineraryIds);
        log.info("List<TravelActivity> activities = {}",activities);

        // 3. 활동을 일정별로 그룹화
        Map<Long, List<TravelActivity>> activitiesByItinerary = activities.stream()
                .collect(Collectors.groupingBy(TravelActivity::getItineraryId));
        log.info(" Map<Long, List<TravelActivity>> activitiesByItinerary = {}",activitiesByItinerary);

        // 4. DTO 변환
        return itineraries.stream()
                .map(itinerary -> ItineraryResponse.fromEntity(
                        itinerary,
                        activitiesByItinerary.get(itinerary.getId())
                ))
                .collect(Collectors.toList());
    }


    /**
     * 사진 조회 (옵션 B: 사진 탭 클릭 시)
     */
//    @Transactional(readOnly = true)
//    public List<PhotoResponse> getPhotos(Long tripId) {
//        List<TravelPhoto> photos = photoRepository.findByTripIdOrderByCreatedAtDesc(tripId);
//
//        // 사용자 정보 한 번에 조회
//        List<Long> userIds = photos.stream()
//                .map(TravelPhoto::getUserId)
//                .distinct()
//                .collect(Collectors.toList());
//
//        Map<Long, UserEntity> userMap = userRepository.findAllById(userIds).stream()
//                .collect(Collectors.toMap(UserEntity::getId, user -> user));
//
//        return photos.stream()
//                .map(photo -> {
//                    UserEntity user = userMap.get(photo.getUserId());
//                    return PhotoResponse.fromEntity(photo, user);
//                })
//                .collect(Collectors.toList());
//    }

    @Transactional
    public AlbumResponse createAlbum(Long tripId, AlbumCreateRequest request, Long userId) {
        log.info("앨범 생성 시작 - tripId: {}, userId: {}, title: {}", tripId, userId, request.getAlbumTitle());

        // 1. 여행 계획 존재 확인
        TravelPlanEntity trip = travelPlanRepository.findById(tripId)
                .orElseThrow(() -> {
                    log.warn("앨범 생성 실패 - 여행 없음: tripId={}", tripId);
                    return new ResourceNotFoundException(
                            "요청한 여행을 찾을 수 없습니다",
                            "TravelPlan not found: tripId=" + tripId
                    );
                });

        // 2. 참여자 권한 확인
        TravelParticipant participant = participantRepository
                .findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> {
                    log.warn("앨범 생성 실패 - 참여자 아님: tripId={}, userId={}", tripId, userId);
                    return new ForbiddenException(
                            "여행 참여자만 앨범을 생성할 수 있습니다",
                            String.format("Not a participant: tripId=%d, userId=%d", tripId, userId)
                    );
                });

        // 3. 앨범 생성
        PhotoAlbum album = PhotoAlbum.builder()
                .tripId(tripId)
                .albumTitle(request.getAlbumTitle())
                .albumDate(request.getAlbumDate())
                .displayOrder(request.getDisplayOrder())
                .build();

        PhotoAlbum savedAlbum = photoAlbumRepository.save(album);

        log.info("앨범 생성 완료 - albumId: {}", savedAlbum.getId());
        return AlbumResponse.fromEntity(savedAlbum);
    }

    /**
     * 앨범에 사진 업로드 (썸네일 포함)
     *
     * 동작 흐름:
     * 1. 앨범 존재 확인
     * 2. 권한 확인 (여행 참여자만)
     * 3. MinIO 업로드 (원본 + 썸네일)
     * 4. DB 저장 (두 URL 모두)
     * 5. Response 반환
     */
    @Transactional
    public PhotoResponse uploadPhotoToAlbum(Long tripId, Long albumId, MultipartFile image, Long userId) {
        log.info("사진 업로드 시작 - tripId: {}, albumId: {}, userId: {}", tripId, albumId, userId);

        // 1. 앨범 존재 확인
        PhotoAlbum album = photoAlbumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("앨범을 찾을 수 없습니다."));

        // 2. 앨범이 해당 여행에 속하는지 확인
        if (!album.getTripId().equals(tripId)) {
            throw new RuntimeException("앨범이 해당 여행에 속하지 않습니다.");
        }

        // 3. 참여자 권한 확인
        TravelParticipant participant = participantRepository
                .findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new RuntimeException("여행 참여자만 사진을 업로드할 수 있습니다."));

        // 4. MinIO에 원본 + 썸네일 업로드
        ImageUploadResponse uploadResult = imageUploadService.uploadImageWithThumbnail(
                image,
                "trip_photos"
        );
        log.info("MinIO 업로드 완료 - 원본: {}, 썸네일: {}",
                uploadResult.getImageUrl(),
                uploadResult.getThumbnailUrl());

        // 5. DB에 사진 메타데이터 저장 (두 URL 모두)
        TravelPhoto photo = TravelPhoto.builder()
                .tripId(tripId)
                .albumId(albumId)
                .userId(userId)
                .imageUrl(uploadResult.getImageUrl())          // 원본 URL
                .thumbnailUrl(uploadResult.getThumbnailUrl())  // 썸네일 URL
                .likesCount(0)
                .build();

        TravelPhoto savedPhoto = photoRepository.save(photo);

        // 6. 사용자 정보 조회
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        log.info("사진 업로드 완료 - photoId: {}", savedPhoto.getId());
        return PhotoResponse.fromEntity(savedPhoto, user);
    }

    /**
     * 앨범 목록 조회 (사진 포함)
     */
    @Transactional
    public List<AlbumResponse> getAlbumsWithPhotos(Long tripId, Long userId) {
        TravelParticipant participant = participantRepository
                .findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new RuntimeException("여행 참여자만 앨범을 조회할 수 있습니다."));

        List<PhotoAlbum> albums = photoAlbumRepository.findByTripIdOrderByAlbumDateDesc(tripId);

        if (albums.isEmpty()) {
            log.info("앨범이 없습니다 - tripId: {}", tripId);
            return List.of();
        }

        List<TravelPhoto> allPhotos =
                photoRepository.findByTripIdOrderByAlbumIdAscCreatedAtAsc(tripId);

        // 3. 사용자 정보 한 번에 조회 (N+1 방지)
        List<Long> userIds = allPhotos.stream()
                .map(TravelPhoto::getUserId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, UserEntity> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));

        // 4. 앨범 ID별로 사진 그룹화
        Map<Long, List<PhotoResponse>> photosByAlbum = allPhotos.stream()
                .collect(Collectors.groupingBy(
                        TravelPhoto::getAlbumId,
                        Collectors.mapping(
                                photo -> PhotoResponse.fromEntity(photo,
                                        userMap.get(photo.getUserId())),
                                Collectors.toList()
                        )
                ));

        // 5. AlbumResponse 생성 (사진 포함)
        List<AlbumResponse> result = albums.stream()
                .map(album -> {
                    List<PhotoResponse> photos = photosByAlbum.getOrDefault(album.getId(), List.of());
                    return AlbumResponse.fromEntityWithPhotos(album, photos);
                })
                .collect(Collectors.toList());

        log.info("앨범 목록 조회 완료 - 앨범 수: {}, 총 사진 수: {}", result.size(), allPhotos.size());
        return result;
    }

    /**
     * 특정 앨범의 사진 목록 조회
     */
    @Transactional(readOnly = true)
    public List<PhotoResponse> getPhotosByAlbum(Long albumId, Long userId) {
        log.info("앨범 사진 조회 시작 - albumId: {}, userId: {}", albumId, userId);

        // 1. 앨범 존재 확인
        PhotoAlbum album = photoAlbumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("앨범을 찾을 수 없습니다."));

        // 👮 권한 검증: 해당 여행의 참여자인지 확인
        TravelParticipant participant = participantRepository
                .findByTripIdAndUserId(album.getTripId(), userId)
                .orElseThrow(() -> new RuntimeException("여행 참여자만 사진을 조회할 수 있습니다."));

        // 2. 사진 조회
        List<TravelPhoto> photos = photoRepository.findByAlbumIdOrderByCreatedAtDesc(albumId);

        // 3. 사용자 정보 조회
        List<Long> userIds = photos.stream()
                .map(TravelPhoto::getUserId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, UserEntity> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));

        List<PhotoResponse> result = photos.stream()
                .map(photo -> PhotoResponse.fromEntity(photo, userMap.get(photo.getUserId())))
                .collect(Collectors.toList());

        log.info("앨범 사진 조회 완료 - 사진 수: {}", result.size());
        return result;
    }

    /**
     * 앨범 삭제
     *
     * 동작 흐름:
     * 1. 앨범 존재 확인
     * 2. 앨범이 해당 여행에 속하는지 확인
     * 3. 권한 확인 (여행 참여자만)
     * 4. 앨범 내 사진들 조회
     * 5. 사진들 삭제 (DB에서만 - MinIO는 유지)
     * 6. 앨범 삭제
     *
     * 주의: MinIO에서는 파일을 삭제하지 않음
     * 이유: 실수로 삭제한 경우 복구 가능
     *
     * @param tripId 여행 ID
     * @param albumId 앨범 ID
     * @param userId 사용자 ID
     */
    @Transactional
    public void deleteAlbum(Long tripId, Long albumId, Long userId) {
        log.info("앨범 삭제 시작 - tripId: {}, albumId: {}, userId: {}", tripId, albumId, userId);

        // 1. 앨범 존재 확인
        PhotoAlbum album = photoAlbumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("앨범을 찾을 수 없습니다."));

        // 2. 앨범이 해당 여행에 속하는지 확인
        if (!album.getTripId().equals(tripId)) {
            throw new RuntimeException("앨범이 해당 여행에 속하지 않습니다.");
        }

        // 3. 권한 확인
        TravelParticipant participant = participantRepository
                .findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new RuntimeException("여행 참여자만 앨범을 삭제할 수 있습니다."));

        // 4. 해당 앨범의 사진들 조회
        List<TravelPhoto> photos = photoRepository.findByAlbumIdOrderByCreatedAtDesc(albumId);

        // 5. 사진들 삭제 (DB에서만)
        if (!photos.isEmpty()) {
            photoRepository.deleteAll(photos);
            log.info("앨범 내 사진 삭제 완료 - 사진 수: {}", photos.size());
        }

        // 6. 앨범 삭제
        photoAlbumRepository.delete(album);
        log.info("앨범 삭제 완료 - albumId: {}", albumId);

    }
    /**
     * 사진 삭제
     *
     * 동작 흐름:
     * 1. 사진 존재 확인
     * 2. 사진이 해당 여행에 속하는지 확인
     * 3. 권한 확인 (본인만 삭제 가능)
     * 4. DB에서 사진 삭제
     *
     * 주의: MinIO에서는 파일을 삭제하지 않음
     *
     * @param tripId 여행 ID
     * @param photoId 사진 ID
     * @param userId 사용자 ID
     */
    @Transactional
    public void deletePhoto(Long tripId, Long photoId, Long userId) {
        log.info("사진 삭제 시작 - tripId: {}, photoId: {}, userId: {}", tripId, photoId, userId);

        // 1. 사진 존재 확인
        TravelPhoto photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("사진을 찾을 수 없습니다."));

        // 2. 사진이 해당 여행에 속하는지 확인
        if (!photo.getTripId().equals(tripId)) {
            throw new RuntimeException("사진이 해당 여행에 속하지 않습니다.");
        }

        // 3. 권한 확인 (본인이 업로드한 사진만 삭제 가능)
        if (!photo.getUserId().equals(userId)) {
            throw new RuntimeException("본인이 업로드한 사진만 삭제할 수 있습니다.");
        }

        // 4. 사진 삭제
        photoRepository.delete(photo);
        log.info("사진 삭제 완료 - photoId: {}", photoId);

        // TODO: MinIO에서도 파일 삭제 (선택적)
    }

    /**
     * 체크리스트 조회 (옵션 B)
     */
//    @Transactional(readOnly = true)
//    public List<ChecklistResponse> getChecklists(Long tripId) {
//        List<TravelChecklist> checklists = checklistRepository.findByTripIdOrderByDisplayOrderAsc(tripId);
//
//        // 담당자 정보 조회
//        List<Long> assigneeIds = checklists.stream()
//                .map(TravelChecklist::getAssigneeUserId)
//                .filter(id -> id != null)
//                .distinct()
//                .collect(Collectors.toList());
//
//        Map<Long, UserEntity> userMap = userRepository.findAllById(assigneeIds).stream()
//                .collect(Collectors.toMap(UserEntity::getId, user -> user));
//
//        return checklists.stream()
//                .map(checklist -> {
//                    UserEntity assignee = checklist.getAssigneeUserId() != null
//                            ? userMap.get(checklist.getAssigneeUserId())
//                            : null;
//                    return ChecklistResponse.fromEntity(checklist, assignee);
//                })
//                .collect(Collectors.toList());
//    }
    /**
     * 공용 체크리스트 조회
     */
    public List<ChecklistResponse> getSharedChecklists(Long tripId) {
        List<TravelChecklist> checklists = checklistRepository
                .findByTripIdAndIsSharedTrueOrderByDisplayOrderAsc(tripId);

        return checklists.stream()
                .map(c -> {
                    UserEntity assignee = c.getAssigneeUserId() != null
                            ? userRepository.findById(c.getAssigneeUserId()).orElse(null)
                            : null;
                    return ChecklistResponse.fromEntity(c, assignee);
                })
                .collect(Collectors.toList());
    }

    /**
     * 개인 체크리스트 조회
     */
    public List<ChecklistResponse> getPersonalChecklists(Long tripId, Long userId) {
        List<TravelChecklist> checklists = checklistRepository
                .findByTripIdAndIsSharedFalseAndAssigneeUserIdOrderByDisplayOrderAsc(tripId, userId);

        UserEntity assignee = userRepository.findById(userId).orElse(null);

        return checklists.stream()
                .map(c -> ChecklistResponse.fromEntity(c, assignee))
                .collect(Collectors.toList());
    }

    /**
     * 체크리스트 생성
     */
    public ChecklistResponse createChecklist(Long tripId, ChecklistCreateRequestDTO dto, Long currentUserId) {
        // displayOrder 자동 설정
        Integer maxOrder = checklistRepository
                .findMaxDisplayOrderByTripIdAndIsShared(tripId, dto.getIsShared());
        int nextOrder = (maxOrder != null ? maxOrder : 0) + 1;

        TravelChecklist checklist = TravelChecklist.builder()
                .tripId(tripId)
                .task(dto.getTask())
                .isShared(dto.getIsShared() != null ? dto.getIsShared() : false)
                .assigneeUserId(dto.getIsShared() ? null : dto.getAssigneeUserId())
                .completed(false)
                .displayOrder(nextOrder)
                .build();

        checklist = checklistRepository.save(checklist);

        UserEntity assignee = checklist.getAssigneeUserId() != null
                ? userRepository.findById(checklist.getAssigneeUserId()).orElse(null)
                : null;

        return ChecklistResponse.fromEntity(checklist, assignee);
    }

   /**
    * * 경비 조회 (옵션 B)
     */
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpenses(Long tripId) {
        List<TravelExpense> expenses = expenseRepository.findByTripIdOrderByExpenseDateDescCreatedAtDesc(tripId);

        // 지불자 정보 조회
        List<Long> paidByIds = expenses.stream()
                .map(TravelExpense::getPaidByUserId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, UserEntity> userMap = userRepository.findAllById(paidByIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));

        return expenses.stream()
                .map(expense -> {
                    UserEntity paidBy = expense.getPaidByUserId() != null
                            ? userMap.get(expense.getPaidByUserId())
                            : null;
                    return ExpenseResponse.fromEntity(expense, paidBy);
                })
                .collect(Collectors.toList());
    }

    /**
     * 체크리스트 생성
     * 경쟁상태가 가능한 부분이라, DB레벨에서 tripId,displayOrder을 묶어서 유니크 인덱스로 생성.
     * @param request
     * @param userId
     * @return
     */
    @Transactional
    public ChecklistResponse createChecklist(ChecklistCreateRequestDTO request, Long userId){
        TravelParticipant member = participantRepository.findByTripIdAndUserId(request.getTripId(),
                        userId).orElseThrow(() -> new RuntimeException("여행 참여자만 체크리스트를 추가할 수 있습니다"));

        // 자동으로 마지막 순서 + 1로 설정 (활동과 동일한 로직)
        try {
            Integer maxOrder = checklistRepository.findMaxDisplayOrderByTripId(request.getTripId());
            Integer order = (maxOrder == null) ? 1 : maxOrder + 1;

            TravelChecklist checklist = TravelChecklist.builder()
                    .tripId(request.getTripId())
                    .task(request.getTask())
                    .completed(false)
                    .assigneeUserId(request.getAssigneeUserId())
                    .displayOrder(order)
                    .build();

            TravelChecklist saved = checklistRepository.save(checklist);

            UserEntity assignee = null;
            if (saved.getAssigneeUserId() != null) {
                assignee = userRepository.findById(saved.getAssigneeUserId()).orElse(null);
            }
            return ChecklistResponse.fromEntity(saved, assignee);
        }catch (DataIntegrityViolationException e ){
            // 유니크 제약조건 위반(중복)
            throw new RuntimeException("체크리스트 생성에 실패했습니다. 다시 시도해주세요.");
        }
    }


    @Transactional
    public UpdateChecklistResponse toggleChecklist(Long checklistId, Long userId){
        TravelChecklist checklist =
                checklistRepository.findById(checklistId)
                        .orElseThrow(() -> new RuntimeException("체크리스트를 찾을 수 없습니다."));
        TravelParticipant member = participantRepository.findByTripIdAndUserId(checklist.getTripId(), userId).orElseThrow(() -> new RuntimeException("여행 참여자만 체크리스트를 수정할 수 있습니다."));
        Boolean currentValue = checklist.getCompleted();
        checklist.setCompleted(!currentValue);

        if(!currentValue){
            checklist.setCompletedAt(LocalDateTime.now());
        }else {
            checklist.setCompletedAt(null);
        }

        return UpdateChecklistResponse.fromEntity(checklist);
    }

    @Transactional
    public DeleteChecklistResponse toggleDelete(Long checklistId, Long userId){
        TravelChecklist target = checklistRepository.findById(checklistId)
                .orElseThrow(() -> new RuntimeException("체크리스트를 찾을 수 없습니다."));

        // 2️⃣ 사용자 검증 (여행 참여자인지 확인)
        TravelParticipant participant = participantRepository
                .findByTripIdAndUserId(target.getTripId(), userId)
                .orElseThrow(() -> new RuntimeException("여행 참여자만 삭제할 수 있습니다."));

        Long tripId = target.getTripId();
        Integer deletedOrder = target.getDisplayOrder();

        checklistRepository.delete(target);

        List<TravelChecklist> remaining = checklistRepository.findByTripIdOrderByDisplayOrderAsc(tripId);
        for (TravelChecklist c : remaining) {
            if (c.getDisplayOrder() > deletedOrder) {
                c.setDisplayOrder(c.getDisplayOrder() - 1);
            }
        }
        return DeleteChecklistResponse.builder()
                .deletedChecklistId(checklistId)
                .tripId(tripId)
                .newTotalCount(remaining.size())
                .build();
    }


    @Transactional
    public ItineraryCreateResponseDTO createItinerary(ItineraryCreateRequestDTO request, Long userId) {
        TravelParticipant member = participantRepository.findByTripIdAndUserId(request.getTripId(),
                userId).orElseThrow(() -> new RuntimeException("여행 참여자만 일정을 추가할 수 있습니다"));

        TravelItinerary build = TravelItinerary.builder()
                .tripId(request.getTripId())
                .dayNumber(request.getDayNumber())
                .date(request.getDate())
                .build();

        TravelItinerary saved = travelItineraryRepository.save(build);

        return ItineraryCreateResponseDTO.fromEntity(saved);
    }

    @Transactional
    public DeleteItineraryResponse deleteItineraries(Long id, Long userId) {
        TravelItinerary travelItinerary = travelItineraryRepository.findById(id).orElseThrow(() -> new RuntimeException("일정이 존재하지 않습니다."));
        TravelParticipant participant = travelParticipantRepository.findByTripIdAndUserId(travelItinerary.getTripId(), userId).orElseThrow(() -> new RuntimeException("여행 참여자만 일정을 추가할 수 있습니다"));

        travelItineraryRepository.delete(travelItinerary);
        return DeleteItineraryResponse.fromEntity(travelItinerary);
    }

    /**
     * 활동 생성
     * 경쟁상태 발성 가능성이 있어서, itinerary_id,display_order을 유니크 인덱스로 설정
     * @param request
     * @param userId
     * @return
     */
    @Transactional
    public ActivityResponse createActivities(ActivityCreateRequest request, Long userId) {
        TravelItinerary itinerary = travelItineraryRepository.findById(request.getItineraryId()).orElseThrow(() -> new RuntimeException("유효한 일정이 아닙니다."));
        TravelParticipant participant = travelParticipantRepository.findByTripIdAndUserId(itinerary.getTripId(), userId).orElseThrow(() -> new RuntimeException("여행 참여자만 일정을 추가할 수 있습니다"));

        try {
            Integer maxOrder = activityRepository.findMaxDisplayOrderByItineraryId(request.getItineraryId())
                    .orElse(0);

            TravelActivity activity = TravelActivity.builder()
                    .itineraryId(itinerary.getId())
                    .time(request.getTime())
                    .title(request.getTitle())
                    .location(request.getLocation())
                    .activityType(request.getActivityType())
                    .durationMinutes(request.getDurationMinutes())
                    .cost(request.getCost())
                    .notes(request.getNotes())
                    .displayOrder(maxOrder + 1)
                    .build();

            TravelActivity saved = activityRepository.save(activity);

            return ActivityResponse.fromEntity(saved);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("활동 생성에 실패했습니다. 다시 시도해주세요.");
        }
    }

    @Transactional
    public ActivityUpdateResponse updateActivities(Long activityId, ActivityUpdateRequest request, Long userId){

        TravelActivity activity = activityRepository.findById(activityId).orElseThrow(() -> new RuntimeException("활동이 존재하지 않습니다."));
        TravelItinerary itinerary = travelItineraryRepository.findById(activity.getItineraryId())
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));

        // 3. 권한 검증
        TravelParticipant participant = participantRepository
                .findByTripIdAndUserId(itinerary.getTripId(), userId)
                .orElseThrow(() -> new RuntimeException("여행 참여자만 활동을 수정할 수 있습니다."));

        if (request.getTime() != null) {
            activity.setTime(request.getTime());
        }
        if (request.getTitle() != null) {
            activity.setTitle(request.getTitle());
        }
        if (request.getLocation() != null) {
            activity.setLocation(request.getLocation());
        }
        if (request.getActivityType() != null) {
            activity.setActivityType(request.getActivityType());
        }
        if (request.getDurationMinutes() != null) {
            activity.setDurationMinutes(request.getDurationMinutes());
        }
        if (request.getCost() != null) {
            activity.setCost(request.getCost());
        }
        if (request.getNotes() != null) {
            activity.setNotes(request.getNotes());
        }

        return ActivityUpdateResponse.fromEntity(activity);
    }

    @Transactional
    public DeleteActivityResponse deleteActivities(Long activityId, Long userId) {
        // 1. 활동 조회
        TravelActivity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("활동이 존재하지 않습니다."));

        // 2. 일정 조회
        TravelItinerary itinerary = travelItineraryRepository.findById(activity.getItineraryId())
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));

        // 3. 권한 검증
        TravelParticipant participant = participantRepository
                .findByTripIdAndUserId(itinerary.getTripId(), userId)
                .orElseThrow(() -> new RuntimeException("여행 참여자만 활동을 삭제할 수 있습니다."));

        // 4. Response 준비 (삭제 전)
        DeleteActivityResponse response = DeleteActivityResponse.fromEntity(activity);

        // 5. 활동 삭제
        activityRepository.delete(activity);

        // 6. Response 반환
        return response;
    }

    /**
     * 외화 설정 조회
     */
    @Transactional(readOnly = true)
    public CurrencySettingsResponse getCurrencySettings(Long tripId, Long userId) {
        log.info("외화 설정 조회 - tripId: {}, userId: {}", tripId, userId);

        // 권한 검증
        participantRepository.findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new RuntimeException("여행 참여자만 조회할 수 있습니다."));

        TravelPlanEntity trip = travelPlanRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("여행을 찾을 수 없습니다."));

        return CurrencySettingsResponse.builder()
                .tripId(tripId)
                .foreignCurrency(trip.getForeignCurrency())
                .exchangeRate(trip.getExchangeRate())
                .currencySymbol(getCurrencySymbol(trip.getForeignCurrency()))
                .build();
    }

    /**
     * 외화 설정 저장
     */
    @Transactional
    public CurrencySettingsResponse updateCurrencySettings(Long tripId, Long userId, CurrencySettingsRequest request) {
        log.info("외화 설정 저장 - tripId: {}, userId: {}, currency: {}, rate: {}",
                tripId, userId, request.getForeignCurrency(), request.getExchangeRate());

        // 권한 검증
        participantRepository.findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new RuntimeException("여행 참여자만 수정할 수 있습니다."));

        TravelPlanEntity trip = travelPlanRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("여행을 찾을 수 없습니다."));

        trip.setForeignCurrency(request.getForeignCurrency());
        trip.setExchangeRate(request.getExchangeRate());
        travelPlanRepository.save(trip);

        log.info("외화 설정 저장 완료 - tripId: {}", tripId);

        return CurrencySettingsResponse.builder()
                .tripId(tripId)
                .foreignCurrency(trip.getForeignCurrency())
                .exchangeRate(trip.getExchangeRate())
                .currencySymbol(getCurrencySymbol(trip.getForeignCurrency()))
                .build();
    }

    /**
     * 통화 코드에 따른 심볼 반환
     */
    private String getCurrencySymbol(String currencyCode) {
        if (currencyCode == null) return "₩";
        return switch (currencyCode.toUpperCase()) {
            case "JPY" -> "¥";
            case "USD" -> "$";
            case "EUR" -> "€";
            case "CNY" -> "¥";
            case "GBP" -> "£";
            case "THB" -> "฿";
            case "VND" -> "₫";
            default -> currencyCode;
        };
    }

}
