package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.SharedFundTrade;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SharedFundTradeResponse {
    private Long id;
    private Long tripId;
    private String type;
    private Long amount;
    private Long balanceAfter;
    private String description;
    private String category;
    private CreatedByInfo createdBy;  // Long → CreatedByInfo 객체
    private LocalDateTime createdAt;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatedByInfo {
        private Long userId;
        private String userName;
    }

    public static SharedFundTradeResponse fromEntity(
            SharedFundTrade trade,  // Response → Entity
            Long tripId,
            String userName
    ) {
        if (trade == null) {
            return null;
        }

        return SharedFundTradeResponse.builder()
                .id(trade.getId())
                .tripId(tripId)
                .type(trade.getTradeType().name())  // Enum → String
                .amount(trade.getAmount())
                .balanceAfter(trade.getBalanceAfter())
                .description(trade.getDescription())
                .category(trade.getCategory())
                .createdBy(CreatedByInfo.builder()
                        .userId(trade.getCreatedBy())
                        .userName(userName)
                        .build())
                .createdAt(trade.getCreatedAt())
                .build();
    }
}
