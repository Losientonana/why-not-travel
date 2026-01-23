package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurrencySettingsRequest {
    /**
     * 외화 코드 (예: "JPY", "USD", null이면 원화만)
     */
    @Size(max = 10, message = "통화 코드는 10자 이하여야 합니다")
    private String foreignCurrency;

    /**
     * 환율 (1 외화 = X 원, 예: 9.3 = 1엔당 9.3원)
     */
    @DecimalMin(value = "0.0001", message = "환율은 0.0001 이상이어야 합니다")
    private BigDecimal exchangeRate;
}
