package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SettlementCompleteRequest {

    @NotNull(message = "fromUserId는 필수입니다")
    private Long fromUserId;

    @NotNull(message = "toUserId는 필수입니다")
    private Long toUserId;

    @NotNull(message = "금액은 필수입니다")
    @Min(value = 1, message = "금액은 1원 이상이어야 합니다")
    private Long amount;

    @Size(max = 500, message = "메모는 500자 이하여야 합니다")
    private String memo;
}