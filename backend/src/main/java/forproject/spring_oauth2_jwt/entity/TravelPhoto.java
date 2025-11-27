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

        @Column(name = "album_id", nullable = false)  // 👈 어느 버킷에 속하는지
        private Long albumId;

        @Column(name = "user_id", nullable = false)
        private Long userId;

        @Column(name = "image_url", nullable = false, length = 500)
        private String imageUrl;

        @Column(name = "thumbnailUrl", length = 500)
        private String thumbnailUrl;

        @Column(name = "likes_count")
        @Builder.Default
        private Integer likesCount = 0;


        @CreationTimestamp
        @Column(name = "created_at", nullable = false, updatable = false)
        private LocalDateTime createdAt;
  }
