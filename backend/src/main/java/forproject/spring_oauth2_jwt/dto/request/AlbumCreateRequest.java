package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlbumCreateRequest {
    @NotBlank(message = "앨범 제목은 필수입니다.")
    @Size(max = 100 , message = "앨범 제목은 100자 이하여야 합니다.")
    private String albumTitle;

    @NotNull(message = "앨범 날짜는 필수입니다.")
    private LocalDate albumDate;

    private Integer displayOrder;
}
