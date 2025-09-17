package forproject.spring_oauth2_jwt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TravelTagDto {
    @NotBlank(message = "태그명은 필수입니다")
    @Size(max = 20, message = "태그명은 20자 이하여야 합니다")
    private String name;

    // 나중에 확장 가능한 필드들
    private String category; // "자연", "음식", "문화" 등
    private Double weight;   // 태그 가중치 (0.0 ~ 1.0)
}