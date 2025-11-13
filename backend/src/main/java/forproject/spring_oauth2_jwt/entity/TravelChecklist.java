package forproject.spring_oauth2_jwt.entity;



import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 여행 체크리스트 엔티티
 */
@Entity
@Table(name = "travel_checklists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class TravelChecklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    /**
     * 체크리스트 내용
     */
    @Column(name = "task", nullable = false, columnDefinition = "TEXT")
    private String task;

    /**
     * 완료 여부
     */
    @Column(name = "completed")
    @Builder.Default
    private Boolean completed = false;

    /**
     * 담당자 ID
     */
    @Column(name = "assignee_user_id")
    private Long assigneeUserId;

    /**
     * 완료 시간
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /**
     * 표시 순서
     */
    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
