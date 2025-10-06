package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "travel_itineraries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelItinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    /**
     * 일차 번호 (1일차, 2일차, 3일차...)
     */
    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    /**
     * 해당 날짜
     */
    @Column(name = "date", nullable = false)
    private LocalDate date;

    /**
     * 제목 (선택사항: "제주 도착", "한라산 등반" 등)
     */
    @Column(name = "title", length = 255)
    private String title;

    /**
     * 메모
     */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
