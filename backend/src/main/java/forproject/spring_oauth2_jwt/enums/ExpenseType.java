package forproject.spring_oauth2_jwt.enums;

public enum ExpenseType {
    /**
     * 개인 지출
     * - 본인만 참여
     * - owedAmount = 0
     * - 정산 불필요
     */
    PERSONAL,

    /**
     * 부분 공동 지출
     * - 여러 명 참여 (최소 2명)
     * - owedAmount 계산 필요
     * - 정산 필요
     */
    PARTIAL_SHARED
}
