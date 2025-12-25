package forproject.spring_oauth2_jwt.dto.request;


import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SettlementApprovalRequest {

    @NotNull(message = "승인 여부는 필수입니다")
    private Boolean approved;  // true: 승인, false: 거절
}