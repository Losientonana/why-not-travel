package forproject.spring_oauth2_jwt.entity;


import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "travel_days")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TravelDayEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id")
    private TravelPlanEntity plan;

    @Column(nullable = false)
    private Integer dayNumber; // 1일차, 2일차

    private String memo;
}