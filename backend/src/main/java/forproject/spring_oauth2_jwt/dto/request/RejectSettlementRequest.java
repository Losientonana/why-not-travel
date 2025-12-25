package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RejectSettlementRequest {

    @Size(max = 500, message = "거절 사유는 500자 이하여야 합니다")
    private String reason;
}
