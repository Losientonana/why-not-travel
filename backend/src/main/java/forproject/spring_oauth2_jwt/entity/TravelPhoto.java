package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 여행 사진 엔티티
 */
@Entity
@Table(name = "travel_photos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    /**
     * 업로드한 사용자 ID
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * 이미지 URL
     */
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    /**
     * 사진 설명
     */
    @Column(name = "caption", columnDefinition = "TEXT")
    private String caption;

    /**
     * 사진 촬영 날짜
     */
    @Column(name = "taken_at")
    private LocalDate takenAt;

    /**
     * 좋아요 개수 (캐시)
     */
    @Column(name = "likes_count")
    @Builder.Default
    private Integer likesCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
