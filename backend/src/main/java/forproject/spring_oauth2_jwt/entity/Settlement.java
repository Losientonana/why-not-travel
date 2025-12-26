package forproject.spring_oauth2_jwt.entity;

import forproject.spring_oauth2_jwt.enums.SettlementStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 정산 내역 Entity
 *
 * 개별정산에서 발생한 빚을 실제로 정산한 내역을 기록합니다.
 * 정산 프로세스:
 * - 채권자(돈 받을 사람)가 완료 처리: 즉시 APPROVED
 * - 채무자(돈 줄 사람)가 완료 신청: PENDING → 채권자가 승인 시 APPROVED
 */
@Entity
@Table(name = "settlement", indexes = {
        @Index(name = "idx_trip_status", columnList = "trip_id, status"),
        @Index(name = "idx_from_user", columnList = "from_user_id"),
        @Index(name = "idx_to_user", columnList = "to_user_id"),
        @Index(name = "idx_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * 어떤 여행의 정산인지
     */
    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    /**
     * 돈을 준 사람 (채무자)
     */
    @Column(name = "from_user_id", nullable = false)
    private Long fromUserId;

    /**
     * 돈을 받는 사람 (채권자)
     */
    @Column(name = "to_user_id", nullable = false)
    private Long toUserId;

    /**
     * 정산 금액
     */
    @Column(name = "amount", nullable = false)
    private Long amount;

    /**
     * 정산 상태
     * - PENDING: 승인 대기 (채무자가 신청, 채권자 승인 필요)
     * - APPROVED: 승인 완료 (채권자가 직접 완료하거나, 채무자 신청을 승인)
     * - REJECTED: 거절됨 (채권자가 채무자의 신청을 거절)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private SettlementStatus status = SettlementStatus.PENDING;

    /**
     * 정산을 요청/완료한 사람
     * - fromUserId와 같으면: 채무자가 "돈 줬어요" 신청
     * - toUserId와 같으면: 채권자가 "돈 받았어요" 완료
     */
    @Column(name = "requested_by", nullable = false)
    private Long requestedBy;

    /**
     * 승인/완료된 시간
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /**
     * 정산 생성 시간
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 메모 (선택사항)
     */
    @Column(name = "memo", length = 500)
    private String memo;
}