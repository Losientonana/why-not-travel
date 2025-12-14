package forproject.spring_oauth2_jwt.dto.response;


import forproject.spring_oauth2_jwt.entity.PhotoAlbum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 앨범 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlbumResponse {

    private Long id;
    private Long tripId;
    private String albumTitle;
    private LocalDate albumDate;
    private Integer displayOrder;
    private Integer photoCount;  // 사진 개수
    private LocalDateTime createdAt;
    private List<PhotoResponse> photos;  // 사진 목록 (선택적)

    /**
     * Entity -> DTO 변환 (사진 목록 없이)
     */
    public static AlbumResponse fromEntity(PhotoAlbum album) {
        return AlbumResponse.builder()
                .id(album.getId())
                .tripId(album.getTripId())
                .albumTitle(album.getAlbumTitle())
                .albumDate(album.getAlbumDate())
                .displayOrder(album.getDisplayOrder())
                .createdAt(album.getCreatedAt())
                .build();
    }

    /**
     * Entity -> DTO 변환 (사진 목록 포함)
     */
    public static AlbumResponse fromEntityWithPhotos(PhotoAlbum album, List<PhotoResponse> photos)
    {
        return AlbumResponse.builder()
                .id(album.getId())
                .tripId(album.getTripId())
                .albumTitle(album.getAlbumTitle())
                .albumDate(album.getAlbumDate())
                .displayOrder(album.getDisplayOrder())
                .photoCount(photos != null ? photos.size() : 0)
                .createdAt(album.getCreatedAt())
                .photos(photos)
                .build();
    }
}