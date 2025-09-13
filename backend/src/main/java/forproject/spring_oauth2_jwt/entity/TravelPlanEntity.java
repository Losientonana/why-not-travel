package forproject.spring_oauth2_jwt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "travel_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPlanEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = true, length = 100)
    private String destination; // 여행지 (ex: "제주도", "일본")

    @Column(nullable = true)
    private String imageUrl; // 여행 대표 이미지

    @Column(nullable = true)
    private Integer estimatedCost; // 예상 비용

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String visibility = "PUBLIC"; // PUBLIC/PRIVATE

    @Column(nullable = false)
    private boolean isDeleted = false;
}

