package forproject.spring_oauth2_jwt.enums;

public enum InvitationStatus {
    PENDING,    // 대기 중
    ACCEPTED,   // 수락됨
    EXPIRED,    // 만료됨 (배치 작업으로 업데이트)
    REJECTED    // 거절됨 (향후 기능)
}
