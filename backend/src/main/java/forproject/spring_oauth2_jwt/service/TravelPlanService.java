package forproject.spring_oauth2_jwt.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import forproject.spring_oauth2_jwt.dto.*;
import forproject.spring_oauth2_jwt.dto.request.ChecklistCreateRequestDTO;
import forproject.spring_oauth2_jwt.dto.response.DeleteChecklistResponse;
import forproject.spring_oauth2_jwt.dto.response.UpdateChecklistResponse;
import forproject.spring_oauth2_jwt.entity.*;
import forproject.spring_oauth2_jwt.enums.BudgetLevel;
import forproject.spring_oauth2_jwt.enums.TravelStyle;
import forproject.spring_oauth2_jwt.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.Check;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    // 일정 생성
    public TravelPlanResponse createTravelPlan(TravelPlanCreateRequestDTO req, Long userId) {
        try {
            log.info("여행 계획 생성 시작 - 사용자: {}, 제목: {}", userId, req.getTitle());

            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

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


            // 초대 이메일 처리 (현재는 로그만 출력)
            if (req.getInviteEmails() != null && !req.getInviteEmails().isEmpty()) {
                log.info("초대할 이메일 목록: {}", req.getInviteEmails());
                // TODO: 이메일 발송 로직 구현
            }

            TravelPlanResponse resp = new TravelPlanResponse();
            resp.setId(saved.getId());
            resp.setTitle(saved.getTitle());
            resp.setStartDate(saved.getStartDate());
            resp.setEndDate(saved.getEndDate());
            resp.setDescription(saved.getDescription());
            resp.setName(user.getName());
            resp.setVisibility(saved.getVisibility());

            log.info("여행 계획 생성 완료 - ID: {}", saved.getId());
            return resp;

        } catch (JsonProcessingException e) {
            log.error("태그 JSON 변환 실패: {}", e.getMessage());
            throw new RuntimeException("여행 계획 생성 중 오류가 발생했습니다.", e);
        }
    }

    // 내 일정 전체 조회
    public List<TravelPlanResponse> listMyPlans(Long userId) {
        List<TravelPlanEntity> plans = travelPlanRepository.findByUser_IdAndIsDeletedFalse(userId);

        List<TravelPlanResponse> result = plans.stream().map(plan -> {
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
        }).collect(Collectors.toList());

        return result;
    }

    public TravelPlanResponse getTravelPlan(Long tripId, Long userId) {
        TravelPlanEntity plan = travelPlanRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> new IllegalArgumentException("해당 여행 계획을 찾을 수 없음"));

        if (!plan.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("이 여행 계획을 조회할 권한이 없습니다.");
        }

        /**
         * 이때 status의 대해서는 재활용성이 높기에 개별 서비스로 분리
         */
        TravelPlanResponse resp = new TravelPlanResponse();
        resp.setId(plan.getId());
        resp.setTitle(plan.getTitle());
        resp.setStartDate(plan.getStartDate());
        resp.setEndDate(plan.getEndDate());
        resp.setDescription(plan.getDescription());
        resp.setName(plan.getUser().getName());
        resp.setDestination(plan.getDestination());
        resp.setVisibility(plan.getVisibility());
//        resp.setCoverImage(plan.getImageUrl());

        return resp;
    }


    public TravelPlanResponse updateTravelPlan(Long tripId, TravelPlanCreateRequestDTO req, Long userId) {
        TravelPlanEntity travelPlanEntity = travelPlanRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> new IllegalArgumentException("해당 여행 계획을 찾을 수 없음"));

        if (!travelPlanEntity.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("이 여행 계획을 수정할 권한이 없습니다.");
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
        // 1. 여행 일정 조회 또는 예외 발생
        TravelPlanEntity travelPlanEntity = travelPlanRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> new IllegalArgumentException("해당 여행 계획을 찾을 수 없습니다."));

        // 2. 소유권 확인 (ID가 다를 경우 예외 발생)
        if (!travelPlanEntity.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("이 여행을 삭제할 권한이 없습니다.");
        }

        // 3. 논리적 삭제 (isDeleted 플래그를 true로 변경)
        travelPlanEntity.setDeleted(true);
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
                .orElseThrow(() -> new IllegalArgumentException("여행을 찾을 수 없습니다: " + tripId));

        // 참여자 조회
        List<TravelParticipant> participants = travelParticipantRepository.findByTripIdOrderByJoinedAt(tripId);
        List<ParticipantDTO> participantDTOS = toParticipantDtos(participants);

        // 통계 계산
        TravelStatisticsDTO statisticsDTO = calculateStatistics(tripId, trip.getEstimatedCost());

        // 현재 사용자 권한 확인
        String currentUserRole = getCurrentUserRole(tripId, userId);
        boolean isOwner = "OWNER".equals(currentUserRole) || trip.getUser().equals(userId);

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
                    return ParticipantDTO.builder()
                            .participantId(participant.getId())
                            .userId(participant.getUserId())
                            .userName(user != null ? user.getUsername() : "Unknown")
                            .userEmail(user != null ? user.getEmail() : "")
                            .role(participant.getRole())
                            .joinedAt(participant.getJoinedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * 통계 계산(COUNT,SUM)
     */
    private TravelStatisticsDTO calculateStatistics(Long tripId, BigDecimal estimatedBudget) {
        // COUNT 쿼리들
        int itineraryCount = itineraryRepository.countByTripId(tripId);
        int photoCount = photoRepository.countByTripId(tripId);
        int totalChecklistCount = checklistRepository.countByTripId(tripId);
        int completedChecklistCount = checklistRepository.countByTripIdAndCompletedTrue(tripId);

        // SUM 쿼리
        BigDecimal totalExpenses = expenseRepository.sumAmountByTripId(tripId);

        // 예산 사용률 계산
        double budgetUsagePercentage = 0.0;
        if (estimatedBudget != null && estimatedBudget.compareTo(BigDecimal.ZERO) > 0) {
            budgetUsagePercentage = totalExpenses
                    .divide(estimatedBudget, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

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
    public List<ItineraryResponse> getItineraries(Long tripId) {
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
                .map(itinerary -> ItineraryResponse.builder()
                        .id(itinerary.getId())
                        .dayNumber(itinerary.getDayNumber())
                        .date(itinerary.getDate())
                        .title(itinerary.getTitle())
                        .notes(itinerary.getNotes())
                        .activities(toActivityDtos(activitiesByItinerary.get(itinerary.getId())))
                        .build())
                .collect(Collectors.toList());

    }

    private List<ActivityResponse> toActivityDtos(List<TravelActivity> activities) {
        if (activities == null) {
            return List.of();
        }

        return activities.stream()
                .map(activity -> ActivityResponse.builder()
                        .id(activity.getId())
                        .time(activity.getTime())
                        .title(activity.getTitle())
                        .location(activity.getLocation())
                        .activityType(activity.getActivityType())
                        .durationMinutes(activity.getDurationMinutes())
                        .cost(activity.getCost())
                        .notes(activity.getNotes())
                        .build())
                .collect(Collectors.toList());
    }


    /**
     * 사진 조회 (옵션 B: 사진 탭 클릭 시)
     */
    @Transactional(readOnly = true)
    public List<PhotoResponse> getPhotos(Long tripId) {
        List<TravelPhoto> photos = photoRepository.findByTripIdOrderByCreatedAtDesc(tripId);

        // 사용자 정보 한 번에 조회
        List<Long> userIds = photos.stream()
                .map(TravelPhoto::getUserId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, UserEntity> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));

        return photos.stream()
                .map(photo -> {
                    UserEntity user = userMap.get(photo.getUserId());
                    return PhotoResponse.builder()
                            .id(photo.getId())
                            .imageUrl(photo.getImageUrl())
                            .caption(photo.getCaption())
                            .takenAt(photo.getTakenAt())
                            .likesCount(photo.getLikesCount())
                            .userId(photo.getUserId())
                            .userName(user != null ? user.getUsername() : "Unknown")
                            .build();
                })
                .collect(Collectors.toList());
    }


    /**
     * 체크리스트 조회 (옵션 B)
     */
    @Transactional(readOnly = true)
    public List<ChecklistResponse> getChecklists(Long tripId) {
        List<TravelChecklist> checklists = checklistRepository.findByTripIdOrderByDisplayOrderAsc(tripId);

        // 담당자 정보 조회
        List<Long> assigneeIds = checklists.stream()
                .map(TravelChecklist::getAssigneeUserId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, UserEntity> userMap = userRepository.findAllById(assigneeIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));

        return checklists.stream()
                .map(checklist -> {
                    UserEntity assignee = checklist.getAssigneeUserId() != null
                            ? userMap.get(checklist.getAssigneeUserId())
                            : null;

                    return ChecklistResponse.builder()
                            .id(checklist.getId())
                            .task(checklist.getTask())
                            .completed(checklist.getCompleted())
                            .assigneeUserId(checklist.getAssigneeUserId())
                            .assigneeName(assignee != null ? assignee.getUsername() : null)
                            .completedAt(checklist.getCompletedAt())
                            .displayOrder(checklist.getDisplayOrder())
                            .build();
                })
                .collect(Collectors.toList());
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

                    return ExpenseResponse.builder()
                            .id(expense.getId())
                            .category(expense.getCategory())
                            .item(expense.getItem())
                            .amount(expense.getAmount())
                            .paidByUserId(expense.getPaidByUserId())
                            .paidByUserName(paidBy != null ? paidBy.getUsername() : null)
                            .expenseDate(expense.getExpenseDate())
                            .notes(expense.getNotes())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ChecklistResponse createChecklist(ChecklistCreateRequestDTO request, Long userId){
        TravelParticipant member = participantRepository.findByTripIdAndUserId(request.getTripId(),
                        userId).orElseThrow(() -> new RuntimeException("여행 참여자만 체크리스트를 추가할 수 있습니다"));

        Integer order = request.getDisplayOrder();
        if (order == null) {
            // 해당 여행의 마지막 순서 + 1
            Integer maxOrder = checklistRepository.findMaxDisplayOrderByTripId(request.getTripId());
            order = (maxOrder == null) ? 0 : maxOrder + 1;
        }

        TravelChecklist checklist = TravelChecklist.builder()
                .tripId(request.getTripId())
                .task(request.getTask())
                .completed(false)
                .assigneeUserId(request.getAssigneeUserId())
                .displayOrder(order)
                .build();

        TravelChecklist saved = checklistRepository.save(checklist);

        String assigneeName = null;
        if (saved.getAssigneeUserId() != null) {
            assigneeName = userRepository.findById(saved.getAssigneeUserId())
                    .map(UserEntity::getUsername)
                    .orElse(null);
        }
        return ChecklistResponse.builder()
                .id(saved.getId())
                .task(saved.getTask())
                .completed(saved.getCompleted())
                .assigneeUserId(saved.getAssigneeUserId())
                .assigneeName(assigneeName)
                .completedAt(saved.getCompletedAt())
                .displayOrder(saved.getDisplayOrder())
                .build();
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

        return UpdateChecklistResponse.builder()
                .id(checklist.getId())
                .completed(checklist.getCompleted())
                .completedAt(checklist.getCompletedAt())
                .build();
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
}
