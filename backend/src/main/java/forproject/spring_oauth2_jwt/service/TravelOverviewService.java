package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.annotation.RequiresTripParticipant;
import forproject.spring_oauth2_jwt.dto.response.TravelOverviewResponse;
import forproject.spring_oauth2_jwt.entity.*;
import forproject.spring_oauth2_jwt.enums.TradeType;
import forproject.spring_oauth2_jwt.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TravelOverviewService {

    private final TravelPlanRepository travelPlanRepository;
    private final SharedFundRepository sharedFundRepository;
    private final SharedFundTradeRepository sharedFundTradeRepository;
    private final IndividualExpenseRepository individualExpenseRepository;
    private final TravelChecklistRepository travelChecklistRepository;
    private final TravelActivityRepository travelActivityRepository;
    private final PhotoAlbumRepository photoAlbumRepository;
    private final TravelItineraryRepository travelItineraryRepository;
    private final TravelPhotoRepository travelPhotoRepository;
    private final TravelParticipantRepository travelParticipantRepository;
    private final UserRepository userRepository;


    @RequiresTripParticipant
    public TravelOverviewResponse getTravelOverview(Long tripId, Long userId) {
        log.info("여행 개요 조회 - TravelId: {}", tripId);

        // 1. 여행 기본 정보
        TravelPlanEntity trip = travelPlanRepository.findById(tripId).orElseThrow(() -> new IllegalArgumentException("여행을 찾을 수 없습니다."));
        Integer daysUntilTrip = DDayCalculator(trip);

        // 여행 기간 계산 (N박 N+1일)
        long duration = ChronoUnit.DAYS.between(trip.getStartDate(), trip.getEndDate()) + 1;

        // 2. 예산 현황 계산
        TravelOverviewResponse.BudgetStatus budgetStatus = calculateBudgetStatus(tripId, trip.getEstimatedCost());

        // 3. 체크리스트 진행률
        TravelOverviewResponse.ChecklistProgress checklistProgress = calculateChecklistProgress(tripId);

        // 4. 오늘의 일정 (최대 3개)
        List<TravelOverviewResponse.TodayScheduleItem> todaySchedule = getTodaySchedule(tripId);

        // 5. 앨범 미리보기 (최근 6개)
        List<TravelOverviewResponse.AlbumPreview> albumPreview = getAlbumPreview(tripId);

        // 6.동행자 목록
        List<TravelOverviewResponse.TravelMember> members = getTripMembers(tripId);

        return TravelOverviewResponse.builder()
                .tripId(trip.getId())
                .title(trip.getTitle())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .description(trip.getDescription())
                .imageUrl(trip.getImageUrl())
                .daysUntilTrip(daysUntilTrip)
                .tripDuration((int) duration)
                .budgetStatus(budgetStatus)
                .checklistProgress(checklistProgress)
                .todaySchedule(todaySchedule)
                .albumPreview(albumPreview)
                .members(members)
                .build();

    }

    private Integer DDayCalculator(TravelPlanEntity trip) {
        LocalDate today = LocalDate.now();
        long daysUntil = ChronoUnit.DAYS.between(today, trip.getStartDate());
        return daysUntil >= 0 ? (int) daysUntil : null;
    }

    /**
     * 체크리스트 진행률 계산 (공용 체크리스트 기준)
     */
    private TravelOverviewResponse.ChecklistProgress calculateChecklistProgress(Long tripId){
        long totalItems = travelChecklistRepository.countByTripIdAndIsSharedTrue(tripId);
        long completedItems = travelChecklistRepository.countCompletedSharedByTripId(tripId);

        double completionPercentage = totalItems > 0
                ? (completedItems * 100.0 / totalItems)
                : 0.0;

        // 미완료 체크리스트 최대 3개 조회
        List<TravelChecklist> incompleteChecklists = travelChecklistRepository
                .findTop3ByTripIdAndIsSharedTrueAndCompletedFalseOrderByDisplayOrderAsc(tripId);

        List<TravelOverviewResponse.ChecklistItem> incompleteItems = incompleteChecklists.stream()
                .map(checklist -> TravelOverviewResponse.ChecklistItem.builder()
                        .id(checklist.getId())
                        .task(checklist.getTask())
                        .isShared(checklist.getIsShared())
                        .build())
                .collect(Collectors.toList());

        return TravelOverviewResponse.ChecklistProgress.builder()
                .totalItems((int) totalItems)
                .completedItems((int) completedItems)
                .completionPercentage(Math.round(completionPercentage * 10) / 10.0)
                .incompleteItems(incompleteItems)
                .build();

    }

    /**
     * 예산 현황 계산
     * - 총 예산: estimatedCost
     * - 사용 금액: 공동경비 지출 + 개별정산 지출 총액
     */
    private TravelOverviewResponse.BudgetStatus calculateBudgetStatus(Long tripId, Long estimatedCost) {
        Long totalBudget = estimatedCost != null ? estimatedCost : 0;

        // 공동경비 지출 합계
        long sharedExpense = 0L;
        Optional<SharedFund> sharedFundOpt = sharedFundRepository.findByTripId(tripId);
        if (sharedFundOpt.isPresent()) {
            Long sharedFundId = sharedFundOpt.get().getId();
            List<SharedFundTrade> trades = sharedFundTradeRepository
                    .findBySharedFundIdAndTradeType(sharedFundId, TradeType.EXPENSE);
            sharedExpense = trades.stream()
                    .mapToLong(SharedFundTrade::getAmount)
                    .sum();
        }

        // 개별정산 지출 합계
        List<IndividualExpense> individualExpenses = individualExpenseRepository
                .findByTripIdOrderByExpenseDateDesc(tripId);
        long individualExpense = individualExpenses.stream()
                .mapToLong(IndividualExpense::getTotalAmount)
                .sum();

        // 총 사용 금액
        long spentAmount = sharedExpense + individualExpense;

        // 남은 예산
        long remainingBudget = totalBudget - spentAmount;

        // 사용률
        double usagePercentage = totalBudget > 0
                ? (spentAmount * 100.0 / totalBudget)
                : 0.0;

        return TravelOverviewResponse.BudgetStatus.builder()
                .totalBudget(totalBudget)
                .spentAmount(spentAmount)
                .remainingBudget(remainingBudget)
                .usagePercentage(Math.round(usagePercentage * 10) / 10.0)  // 소수점 첫째자리
                .build();
    }

    /**
     * 오늘의 일정 조회 (최대 3개)
     */
    private List<TravelOverviewResponse.TodayScheduleItem> getTodaySchedule(Long tripId) {

        LocalDate today = LocalDate.now();

        List<TravelActivity> activities = travelActivityRepository.findTop3ByTripIdAndDate(tripId, today);

        return activities.stream()
                .map(activity -> TravelOverviewResponse.TodayScheduleItem.builder()
                        .id(activity.getId())
                        .time(activity.getTime() != null ? activity.getTime().toString() : "")
                        .title(activity.getTitle())
                        .location(activity.getLocation())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 앨범 미리보기 (최근 6개)
     */
    private List<TravelOverviewResponse.AlbumPreview> getAlbumPreview(Long tripId) {
        // 1. 최근 앨범 6개 조회
        List<PhotoAlbum> albums = photoAlbumRepository.findTop6ByTripIdOrderByAlbumDateDescCreatedAtDesc(tripId);

        if (albums.isEmpty()) {
            return List.of();
        }

        // 2. 앨범 ID 추출
        List<Long> albumIds = albums.stream()
                .map(PhotoAlbum::getId)
                .collect(Collectors.toList());

        // 3. 각 앨범의 사진들 조회
        List<TravelPhoto> allPhotos = travelPhotoRepository.findByAlbumIdIn(albumIds);

        // 4. 앨범별로 사진 그룹화
        Map<Long, List<TravelPhoto>> photosByAlbum = allPhotos.stream()
                .collect(Collectors.groupingBy(TravelPhoto::getAlbumId));

        // 5. 앨범별 사진 개수 계산
        Map<Long, Long> photoCountByAlbum = allPhotos.stream()
                .collect(Collectors.groupingBy(TravelPhoto::getAlbumId, Collectors.counting()));

        // 6. AlbumPreview DTO 생성
        return albums.stream()
                .map(album -> {
                    List<TravelPhoto> photos = photosByAlbum.getOrDefault(album.getId(), List.of());
                    String thumbnailUrl = photos.isEmpty() ? null : photos.get(0).getThumbnailUrl();
                    Integer photoCount = photoCountByAlbum.getOrDefault(album.getId(), 0L).intValue();

                    return TravelOverviewResponse.AlbumPreview.builder()
                            .albumId(album.getId())
                            .albumTitle(album.getAlbumTitle())
                            .albumDate(album.getAlbumDate())
                            .thumbnailUrl(thumbnailUrl)
                            .photoCount(photoCount)
                            .build();
                })
                .collect(Collectors.toList());
    }
    /**
     * 여행 멤버 목록 조회
     */
    private List<TravelOverviewResponse.TravelMember> getTripMembers(Long tripId) {
        List<TravelParticipant> participants = travelParticipantRepository.findByTripIdOrderByJoinedAt(tripId);

        if (participants.isEmpty()) {
            return List.of();
        }

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
                    if (user == null) {
                        return null;
                    }
                    return TravelOverviewResponse.TravelMember.builder()
                            .userId(user.getId())
                            .userName(user.getName())
                            .email(user.getEmail())
//                            .profileImage(user.getProfileImage())
                            .role(participant.getRole())
                            .build();
                })
                .filter(member -> member != null)
                .collect(Collectors.toList());
    }


}

