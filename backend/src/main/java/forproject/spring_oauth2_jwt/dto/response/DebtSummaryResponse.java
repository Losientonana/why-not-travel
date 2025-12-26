package forproject.spring_oauth2_jwt.dto.response;


import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DebtSummaryResponse {

    /**
     * 현재 사용자의 총 받을 금액
     */
    private Long totalToReceive;

    /**
     * 현재 사용자의 총 줄 금액
     */
    private Long totalToPay;

    /**
     * 채권자 목록 (돈 받을 사람들)
     */
    private List<UserDebt> creditors;

    /**
     * 채무자 목록 (돈 줄 사람들)
     */
    private List<UserDebt> debtors;

    /**
     * 최적화된 정산 결과 (Greedy 알고리즘)
     */
    private List<OptimalTransaction> optimalTransactions;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDebt {
        private Long userId;
        private String userName;
        private Long amount;  // 양수: 받을 돈, 음수: 줄 돈
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptimalTransaction {
        private Long fromUserId;
        private String fromUserName;
        private Long toUserId;
        private String toUserName;
        private Long amount;
    }
}
