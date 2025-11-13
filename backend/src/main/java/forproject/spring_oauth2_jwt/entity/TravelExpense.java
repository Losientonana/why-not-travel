package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 여행 경비 엔티티
 */
@Entity
@Table(name = "travel_expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    /**
     * 카테고리: TRANSPORT(교통), FOOD(식비), ACCOMMODATION(숙박), ACTIVITY(활동), ETC(기타)
     */
    @Column(name = "category", nullable = false, length = 50)
    private String category;

    /**
     * 항목명
     */
    @Column(name = "item", nullable = false, length = 255)
    private String item;

    /**
     * 금액
     */
    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    /**
     * 지불한 사용자 ID
     */
    @Column(name = "paid_by_user_id")
    private Long paidByUserId;

    /**
     * 지출 날짜
     */
    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    /**
     * 메모
     */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}