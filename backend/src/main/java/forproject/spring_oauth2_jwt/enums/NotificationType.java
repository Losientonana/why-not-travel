package forproject.spring_oauth2_jwt.enums;

public enum NotificationType {

        INVITATION,             // 여행 초대
        SYSTEM,                 // 시스템 알림
        SETTLEMENT_REQUEST,     // 정산 신청 (채무자 → 채권자)
        SETTLEMENT_APPROVED,    // 정산 승인 (채권자 → 채무자)
        SETTLEMENT_REJECTED,    // 정산 거절 (채권자 → 채무자)
        SETTLEMENT_COMPLETED    // 정산 완료 (채권자 직접 완료 시)
}
