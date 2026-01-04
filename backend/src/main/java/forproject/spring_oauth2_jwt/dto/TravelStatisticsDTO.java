package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelStatisticsDTO {
    /**
     * 일정 개수
     */
    private int itineraryCount;

    /**
     * 사진 개수
     */
    private int photoCount;

    /**
     * 완료된 체크리스트 개수
     */
    private int completedChecklistCount;

    /**
     * 전체 체크리스트 개수
     */
    private int totalChecklistCount;

    /**
     * 총 지출 금액
     */
    private BigDecimal totalExpenses;

    /**
     * 예상 예산
     */
    private Long estimatedBudget;

    /**
     * 예산 사용률(%)
     */
    private Double budgetUsagePercentage;
}
