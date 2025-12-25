package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.Settlement;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettlementResponse {
    private Long id;
    private Long tripId;
    private Long fromUserId;
    private String fromUserName;
    private Long toUserId;
    private String toUserName;
    private Long amount;
    private String status;
    private Long requestedBy;
    private String requestedByName;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private String memo;

    public static SettlementResponse fromEntity(
            Settlement settlement,
            String fromUserName,
            String toUserName,
            String requestedByName
    ) {
        return SettlementResponse.builder()
                .id(settlement.getId())
                .tripId(settlement.getTripId())
                .fromUserId(settlement.getFromUserId())
                .fromUserName(fromUserName)
                .toUserId(settlement.getToUserId())
                .toUserName(toUserName)
                .amount(settlement.getAmount())
                .status(settlement.getStatus().name())
                .requestedBy(settlement.getRequestedBy())
                .requestedByName(requestedByName)
                .completedAt(settlement.getCompletedAt())
                .createdAt(settlement.getCreatedAt())
                .memo(settlement.getMemo())
                .build();
    }
}
