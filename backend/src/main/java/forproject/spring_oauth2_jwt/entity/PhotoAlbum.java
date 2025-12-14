package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "photo_albums")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhotoAlbum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;                      // 어느 여행인지

    @Column(name = "album_title", nullable = false, length = 100)
    private String albumTitle;                // "제주도 첫째날"

    @Column(name = "album_date", nullable = false)
    private LocalDate albumDate;              // 2024-03-15

    @Column(name = "display_order")
    private Integer displayOrder;             // 순서 (선택)

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}