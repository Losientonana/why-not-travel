package forproject.spring_oauth2_jwt.dto.request;


import forproject.spring_oauth2_jwt.enums.SplitMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SharedExpenseCreateRequest {

    @NotNull(message = "날짜는 필수입니다")
    private LocalDate date;

    @NotBlank(message = "카테고리는 필수입니다")
    @Size(max = 50, message = "카테고리는 50자 이하여야 합니다")
    private String category;

    @NotNull(message = "금액은 필수입니다")
    @Min(value = 1, message = "금액은 1원 이상이어야 합니다")
    private Long amount;

    /**
     * 외화 금액 (선택사항, 예: JPY)
     */
    @Min(value = 0, message = "외화 금액은 0 이상이어야 합니다")
    private Long foreignCurrencyAmount;

    @NotBlank(message = "설명은 필수입니다")
    @Size(max = 200, message = "설명은 200자 이하여야 합니다")
    private String description;

    @NotNull(message = "분담 방식은 필수입니다")
    private SplitMethod splitMethod;

    @NotEmpty(message = "참여자는 최소 2명 이상이어야 합니다")
    @Size(min = 2, message = "공유 지출은 최소 2명 이상이어야 합니다")
    @Valid
    private List<ParticipantInput> participants;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ParticipantInput {
        @NotNull(message = "사용자 ID는 필수입니다")
        private Long userId;

        @NotNull(message = "분담 금액은 필수입니다")
        @Min(value = 0, message = "분담 금액은 0원 이상이어야 합니다")
        private Long shareAmount;

        @NotNull(message = "지불 금액은 필수입니다")
        @Min(value = 0, message = "지불 금액은 0원 이상이어야 합니다")
        private Long paidAmount;
    }
}
