package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 사진 응답 DTO
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhotoResponse {

    private Long id;
    private String imageUrl;
    private String caption;
    private LocalDate takenAt;
    private Integer likesCount;
    private Long userId;
    private String userName;
}