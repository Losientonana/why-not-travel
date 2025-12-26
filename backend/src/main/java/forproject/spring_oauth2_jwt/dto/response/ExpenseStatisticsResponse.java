package forproject.spring_oauth2_jwt.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseStatisticsResponse {

    /**
     * 내 총 지출액
     */
    private Long myTotalExpense;

    /**
     * 1인당 평균 지출액 (여행 멤버 전체)
     */
    private Long averagePerPerson;

    /**
     * 카테고리별 지출 (나 기준)
     */
    private List<CategoryBreakdown> categoryBreakdown;

    /**
     * 개인별 지출 (모든 멤버)
     */
    private List<PersonalBreakdown> personalBreakdown;

    /**
     * 일별 지출 추이 (나 기준)
     */
    private List<DailyExpense> dailyExpenses;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryBreakdown {
        private String category;
        private Long amount;
        private Double percentage;
        private String color;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PersonalBreakdown {
        private Long userId;
        private String userName;
        private Long amount;
        private Double percentage;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyExpense {
        private String date;  // yyyy-MM-dd
        private Long amount;
    }
}
