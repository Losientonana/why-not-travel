package forproject.spring_oauth2_jwt.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SettlementPlanResponse {
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private Long amount;
}