package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 여행 세부 활동 엔티티
 * - 각 일정(Itinerary)에 여러 활동 포함
 * - 09:00 공항 도착, 11:00 렌터카 픽업 등
 */
@Entity
@Table(name = "travel_activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "itinerary_id", nullable = false)
    private Long itineraryId;

    /**
     * 시간 (09:00, 14:30 등)
     */
    @Column(name = "time")
    private LocalTime time;

    /**
     * 활동 제목
     */
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    /**
     * 장소
     */
    @Column(name = "location", length = 255)
    private String location;

    /**
     * 활동 타입: TRANSPORT(이동), FOOD(식사), ACTIVITY(활동), ACCOMMODATION(숙박), REST(휴식)
     */
    @Column(name = "activity_type", length = 50)
    private String activityType;

    /**
     * 소요 시간 (분)
     */
    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    /**
     * 비용
     */
    @Column(name = "cost", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal cost = BigDecimal.ZERO;

    /**
     * 메모
     */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /**
     * 표시 순서 (같은 날짜 내 정렬용)
     */
    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

}
