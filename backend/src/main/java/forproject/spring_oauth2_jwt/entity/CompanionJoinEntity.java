package forproject.spring_oauth2_jwt.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "companion_joins")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CompanionJoinEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private CompanionPostEntity post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(nullable = false)
    private String status; // 신청, 수락, 거절

    @CreationTimestamp
    private LocalDateTime appliedAt;
}

