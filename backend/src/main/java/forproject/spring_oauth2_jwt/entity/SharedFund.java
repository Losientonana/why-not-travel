package forproject.spring_oauth2_jwt.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "shared_fund")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SharedFund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * 여행 ID
     */
    @Column(name = "trip_id", nullable = false, unique = true)
    private Long tripId;

    /**
     * 현재 잔액
     * - 입금하면 증가, 출금하면 감소
     */
    @Column(name = "current_balance", nullable = false)
    @Builder.Default
    private Long currentBalance = 0L;

    /**
     * 총 입금액 (누적)
     * - 통계 및 감사용
     */
    @Column(name = "total_deposits", nullable = false)
    @Builder.Default
    private Long totalDeposits = 0L;

    /**
     * 총 출금액 (누적)
     * - 통계 및 감사용
     */
    @Column(name = "total_expenses", nullable = false)
    @Builder.Default
    private Long totalExpenses = 0L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;


}
