package forproject.spring_oauth2_jwt.entity;

import forproject.spring_oauth2_jwt.enums.ExpenseType;
import forproject.spring_oauth2_jwt.enums.SplitMethod;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "individual_expense", indexes = {
        @Index(name = "idx_trip_date", columnList = "trip_id, expense_date"),
        @Index(name = "idx_trip_type", columnList = "trip_id, expense_type"),
        @Index(name = "idx_created_by", columnList = "created_by")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class IndividualExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    /**
     * 지출 유형
     * - PERSONAL: 개인 지출 (본인만, 정산 불필요)
     * - PARTIAL_SHARED: 공유 지출 (여러 명, 정산 필요)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "ExpenseType", nullable = false)
    private ExpenseType expenseType;


    /**
     * 총 금액
     */
    @Column(name = "total_amount", nullable = false)
    private Long totalAmount;

    /**
     * 지출 설명 (프론트에서 최대 200자 제한)
     */
    @Column(name = "description", nullable = false, length = 200)
    private String description;

    /**
     * 카테고리: 식비, 교통, 숙박, 관광, 쇼핑, 기타
     */
    @Column(name = "category", nullable = false, length = 50)
    private String category;

    /**
     * 지출 날짜 (시간 제외)
     */
    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    /**
     * 분담 방식
     * - EQUAL: 균등 분할 (n/1)
     * - CUSTOM: 사용자 지정 금액
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "split_method", nullable = false, length = 20)
    private SplitMethod splitMethod;

    /**
     * 지출 작성자 (계산한 사람)
     */
    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    /**
     * 영수증 URL (선택사항)
     * 프론트 등록 모달에는 없지만, 추후 확장 가능성 고려
     */
//    @Column(name = "receipt_url", length = 500)
//    private String receiptUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 참여자 리스트 (양방향 관계)
     */
    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ExpenseParticipant> participants = new ArrayList<>();

}
