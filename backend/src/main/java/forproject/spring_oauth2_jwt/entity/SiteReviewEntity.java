package forproject.spring_oauth2_jwt.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "site_reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SiteReviewEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(nullable = false, length = 1000)
    private String content;

    private Integer rating;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

