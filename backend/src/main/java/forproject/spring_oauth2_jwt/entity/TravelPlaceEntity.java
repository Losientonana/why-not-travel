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

    private String memo;
}
