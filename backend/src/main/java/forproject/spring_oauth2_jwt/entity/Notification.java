package forproject.spring_oauth2_jwt.entity;

import forproject.spring_oauth2_jwt.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 알림을 받을 사용자 ID
     */
    @Column(nullable = false)
    private Long userId;

    /**
     * 알림 타입 (INVITATION, COMMENT, LIKE 등)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationType type;

    /**
     * 알림 제목
     */
    @Column(nullable = false, length = 200)
    private String title;

    /**
     * 알림 내용
     */
    @Column(nullable = false, length = 500)
    private String content;

    /**
     * 관련 데이터 (초대 토큰, 게시글 ID 등)
     */
    @Column(length = 200)
    private String relatedData;

    /**
     * 읽음 여부
     */
    @Column(nullable = false)
    private boolean isRead = false;

    /**
     * 생성 시간
     */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 읽은 시간
     */
    @Column(nullable = true)
    private LocalDateTime readAt;
}
