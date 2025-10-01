package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity
@Table(name = "travel_places")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TravelPlaceEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "day_id")
    private TravelDayEntity day;

    @Column(nullable = false)
    private String name;

    private String location;

    @Column(nullable = true)
    private Double latitude; // 위도

    @Column(nullable = true)
    private Double longitude; // 경도

    @Column(nullable = true, length = 50)
    private String placeType; // 장소 유형 (관광지, 맛집, 숙박 등)

    @Column(nullable = true)
    private Integer orderIndex; // 방문 순서

    private String memo;
}
