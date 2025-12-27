package forproject.spring_oauth2_jwt.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelOverviewResponse {

    // 여행 기본 정보
    private Long tripId;
    private String title;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String imageUrl;
    private Integer daysUntilTrip;  // D-Day
    private Integer tripDuration;   // 여행 기간 (일수)

    // 예산 현황
    private BudgetStatus budgetStatus;

    // 체크리스트 진행률
    private ChecklistProgress checklistProgress;

    // 오늘의 일정 (최대 3개)
    private List<TodayScheduleItem> todaySchedule;

    // 앨범 미리보기 (최근 6장)
    private List<AlbumPreview> albumPreview;

    // 동행자 목록
    private List<TravelMember> members;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BudgetStatus {
        private Long totalBudget;        // 총 예산 (estimatedCost)
        private Long spentAmount;        // 사용 금액 (공동경비 + 개별정산)
        private Long remainingBudget;    // 남은 예산
        private Double usagePercentage;  // 사용률 (%)
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChecklistProgress {
        private Integer totalItems;
        private Integer completedItems;
        private Double completionPercentage;
        private List<ChecklistItem> incompleteItems;  // 미완료 체크리스트 최대 3개
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChecklistItem {
        private Long id;
        private String task;
        private Boolean isShared;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TodayScheduleItem {
        private Long id;
        private String time;      // "09:00"
        private String title;     // "제주공항 도착"
        private String location;  // "제주국제공항"
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlbumPreview {
        private Long albumId;
        private String albumTitle;
        private LocalDate albumDate;
        private String thumbnailUrl;  // 앨범의 첫 번째 사진 썸네일
        private Integer photoCount;   // 앨범 내 사진 개수
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TravelMember {
        private Long userId;
        private String userName;
        private String email;
        private String profileImage;
        private String role;  // "OWNER", "EDITOR", "VIEWER"
    }
}