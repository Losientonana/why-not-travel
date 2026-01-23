package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * ✅ 프론트엔드 매칭:
 * - amountPerPerson: 1인당 입금액
 * - description: 메모 (선택사항)
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SharedFundDepositRequest {
    /**
     * 1인당 입금액 (원화)
     */
    @NotNull(message = "1인당 입금액은 필수입니다.")
    @Min(value = 0, message = "1인당 입금액은 0원 이상이어야 합니다.")
    private Long amountPerPerson;

    /**
     * 1인당 외화 입금액 (선택사항, 예: JPY)
     */
    @Min(value = 0, message = "외화 금액은 0 이상이어야 합니다.")
    private Long foreignCurrencyAmountPerPerson;

    /**
     * 입금 설명 (메모)
     */
    @Size(max = 500, message = "메모는 500자 이하여야 합니다.")
    private String description;
}
