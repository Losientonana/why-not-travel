package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SharedFundDepositRequest {
    /**
     * 입금액
     */
    @NotNull(message = "입금액은 필수입니다.")
    @DecimalMin(value = "1.0", message = "입금액은 최소 1원 이상이어야 합니다.")
    @DecimalMax(value = "100000000.0", message = "입금액은 최대 1억원 이하여야 합니다.")
    private BigDecimal amount;

    /**
     * 입금 설명
     */
    @NotBlank(message = "입금 설명은 필수입니다.")
    @Size(max = 500, message = "입금 설명은 500자 이하여야 합니다.")
    private String description;
}
