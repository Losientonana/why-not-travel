package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.TravelPhoto;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhotoResponse {
    private Long id;
    private Long albumId;
    private String imageUrl;
    private String thumbnailUrl;
    private Integer likesCount;
    private Long userId;
    private String userName;
    private LocalDateTime createdAt;

    public static PhotoResponse fromEntity(TravelPhoto photo, UserEntity user) {
        return PhotoResponse.builder()
                .id(photo.getId())
                .albumId(photo.getAlbumId())
                .imageUrl(photo.getImageUrl())
                .thumbnailUrl(photo.getThumbnailUrl())
                .likesCount(photo.getLikesCount())
                .userId(photo.getUserId())
                .userName(user != null ? user.getUsername() : "Unknown")
                .createdAt(photo.getCreatedAt())
                .build();
    }
}
