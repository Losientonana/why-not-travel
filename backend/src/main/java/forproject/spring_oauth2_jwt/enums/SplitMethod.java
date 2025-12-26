package forproject.spring_oauth2_jwt.enums;
public enum SplitMethod {
    /**
     * 균등 분할
     * - shareAmount = totalAmount / 참여자수
     */
    EQUAL,

    /**
     * 사용자 지정
     * - shareAmount = 프론트에서 직접 입력
     * - 검증: shareAmount 합계 = totalAmount
     */
    CUSTOM   // 사용자 정의
}
