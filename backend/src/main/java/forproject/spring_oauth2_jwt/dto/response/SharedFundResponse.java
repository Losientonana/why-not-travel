package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.SharedFund;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SharedFundResponse {
    private Long id;
    private Long tripId;
    private Long CurrentBalance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SharedFundResponse fromEntity(SharedFund sharedFund) {
        if (sharedFund == null) {
            return null;
        }

        return SharedFundResponse.builder()
                .id(sharedFund.getId())
                .tripId(sharedFund.getTripId())
                .CurrentBalance(sharedFund.getCurrentBalance())
                .createdAt(sharedFund.getCreatedAt())
                .updatedAt(sharedFund.getUpdatedAt())
                .build();
    }
}
