package forproject.spring_oauth2_jwt.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurrencySettingsResponse {
    private Long tripId;
    private String foreignCurrency;  // "JPY", "USD" 등 (null이면 KRW만)
    private BigDecimal exchangeRate; // 1 외화 = X 원 (예: 9.3 = 1엔당 9.3원)
    private String currencySymbol;   // "¥", "$" 등
}
