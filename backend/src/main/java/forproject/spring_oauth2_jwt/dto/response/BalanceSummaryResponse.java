package forproject.spring_oauth2_jwt.dto.response;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 개별정산 + 그리디 알고리즘 통합 응답
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BalanceSummaryResponse {

    // === 개별정산 집계 (있는 그대로의 잔액) ===
    private Long totalToReceive;  // 내가 받을 총금액
    private Long totalToPay;      // 내가 줄 총금액
    private List<PersonBalance> creditors;  // 나에게 줄 사람들 (상세)
    private List<PersonBalance> debtors;    // 내가 줄 사람들 (상세)

    // === 그리디 알고리즘 최적 정산 가이드 ===
    private List<SettlementPlanResponse> optimalPlan;  // 최적 정산 플랜

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PersonBalance {
        private Long userId;
        private String userName;
        private Long amount;  // 양수: 받을 돈, 음수: 줄 돈
    }
}