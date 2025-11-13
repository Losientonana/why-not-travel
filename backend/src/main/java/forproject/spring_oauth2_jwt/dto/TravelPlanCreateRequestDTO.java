package forproject.spring_oauth2_jwt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TravelPlanCreateRequestDTO {
    @NotBlank(message = "여행 제목은 필수 입니다")
    @Size(max = 100)
    private String title;

    @NotNull(message = "시작일은 필수 입니다")
    private LocalDate startDate;

    @NotNull(message = "종료일은 필수 입니다")
    private LocalDate endDate;

    @Size(max = 300)
    private String description;

    @Size(max = 100, message = "여행지는 100자 이하여야 합니다.")
    private String destination;

    private String imageUri;

    private BigDecimal estimatedCost;

    @Valid
    @Size(max = 10, message = "태그는 최대 10개까지 선택 가능합니다")
    private List<TravelTagDto> tags; // 여행 태그 리스트

    @Size(max = 30, message = "여행 스타일은 30자 이하여야 합니다")
    private String travelStyle; // HEALING, ADVENTURE, CULTURE, GOURMET

    @Size(max = 20, message = "예산 수준은 20자 이하여야 합니다")
    private String budgetLevel; // BUDGET, MID_RANGE, LUXURY

    @NotBlank(message = "공개 설정은 필수입니다.")
    private String visibility;

    // 초대할 이메일 목록 추가
    @Size(max = 20, message = "초대할 사람은 최대 20명까지 가능합니다")
    private List<@Email(message = "올바른 이메일 형식이어야 합니다") String> inviteEmails;
}