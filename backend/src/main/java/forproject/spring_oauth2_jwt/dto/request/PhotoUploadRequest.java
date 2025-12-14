package forproject.spring_oauth2_jwt.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

/**
 * 사진 업로드 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoUploadRequest {

    /**
     * 업로드할 이미지 파일
     */
    private MultipartFile image;

    /**
     * 사진 설명 (선택적)
     */
    @Size(max = 500, message = "사진 설명은 500자 이하여야 합니다")
    private String caption;

    /**
     * 사진 촬영 날짜 (선택적)
     */
    private LocalDate takenAt;
}
