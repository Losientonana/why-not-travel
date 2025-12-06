//package forproject.spring_oauth2_jwt.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.CreationTimestamp;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "verification_tokens")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class VerificationToken {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private UserEntity user;
//
//    @Column(nullable = false, unique = true, length = 100)
//    private String token;
//
//    @Column(nullable = false, length = 30)
//    private String tokenType;
//
//    // 만료 시간
//    @Column(nullable = false)
//    private LocalDateTime expiresAt;
//
//    // 생성 시간
//    @CreationTimestamp
//    private LocalDateTime createdAt;
//
//
//}
