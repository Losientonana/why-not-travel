package forproject.spring_oauth2_jwt.dto;

import forproject.spring_oauth2_jwt.entity.TravelPhoto;
import forproject.spring_oauth2_jwt.entity.UserEntity;
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

    public static PhotoResponse fromEntity(TravelPhoto photo, UserEntity user) {
        return PhotoResponse.builder()
                .id(photo.getId())
                .imageUrl(photo.getImageUrl())
                .caption(photo.getCaption())
                .takenAt(photo.getTakenAt())
                .likesCount(photo.getLikesCount())
                .userId(photo.getUserId())
                .userName(user != null ? user.getUsername() : "Unknown")
                .build();
    }
}