package forproject.spring_oauth2_jwt.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "expense_participant", indexes = {
        @Index(name = "idx_expense_user", columnList = "expense_id, user_id"),
        @Index(name = "idx_user_owed", columnList = "user_id, owed_amount")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ExpenseParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private IndividualExpense expense;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * 이 사람의 분담 금액
     * - EQUAL: totalAmount / 참여자수
     * - CUSTOM: 사용자가 직접 입력한 값
     */
    @Column(name = "share_amount", nullable = false)
    private Long shareAmount;

    /**
     * 이 사람이 실제로 낸 금액
     * - 계산한 사람: totalAmount
     * - 나머지: 0
     */
    @Column(name = "paid_amount", nullable = false)
    @Builder.Default
    private Long paidAmount = 0L;

    /**
     * 받을 금액(+) 또는 줄 금액(-)
     * = paidAmount - shareAmount
     *
     * 예시:
     * - 30,000원 내고 분담액 10,000원 → +20,000 (받을 돈)
     * - 0원 내고 분담액 10,000원 → -10,000 (줄 돈)
     * - 15,000원 내고 분담액 15,000원 → 0 (개인지출)
     */
    @Column(name = "owed_amount", nullable = false)
    private Long owedAmount;

    /**
     * 정산 완료된 금액 (현재 미사용)
     * - 향후 확장용 필드
     * - 기본값: 0
     */
    @Column(name = "settled_amount", nullable = false)
    @Builder.Default
    private Long settledAmount = 0L;
}
