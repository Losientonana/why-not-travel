package forproject.spring_oauth2_jwt.entity;

import forproject.spring_oauth2_jwt.enums.TradeType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "shared_fund_trade", indexes = {
        @Index(name = "idx_shared_fund_created", columnList = "shared_fund_id, created_at"),
        @Index(name = "idx_trade_type", columnList = "shared_fund_id, trade_type")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SharedFundTrade {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 공동 경비 계좌 ID
     */
    @Column(name = "shared_fund_id", nullable = false)
    private Long sharedFundId;

    /**
     * 거래 유형
     * - DEPOSIT: 입금
     * - EXPENSE: 출금(지출)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "trade_type", nullable = false, length = 20)
    private TradeType tradeType;

    /**
     * 거래 금액
     */
    @Column(nullable = false)
    private Long amount;

    /**
     * 거래 전 잔액
     */
//    @Column(nullable = false, precision = 15, scale = 2)
//    private BigDecimal balanceBefore;

    /**
     * 거래 후 잔액
     * - DEPOSIT: balanceBefore + amount
     * - EXPENSE: balanceBefore - amount
     */
    @Column(name = "balance_after",nullable = false)
    private Long balanceAfter;

    /**
     * 거래 설명
     */
    @Column(nullable = false, length = 500)
    private String description;

    /**
     * 카테고리 (출금 시에만 사용)
     * - 예: "교통", "숙박", "식비", "관광", "쇼핑", "기타"
     */
    @Column(length = 50)
    private String category;

    /**
     * 거래 생성자 (입금/출금한 사용자)
     */
    @Column(name = "created_by",nullable = false)
    private Long createdBy;

    /**
     * 거래 생성 시각 (변경 불가)
     */
    @CreationTimestamp
    @Column(name = "created_at",nullable = false, updatable = false)
    private LocalDateTime createdAt;

}
