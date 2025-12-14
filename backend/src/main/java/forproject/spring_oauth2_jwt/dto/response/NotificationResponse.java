package forproject.spring_oauth2_jwt.dto.response;

import forproject.spring_oauth2_jwt.entity.Notification;
import forproject.spring_oauth2_jwt.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 알림 응답 DTO
 * SSE 전송 및 API 응답용
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private Long userId;
    private NotificationType type;
    private String title;
    private String content;
    private String relatedData;
    private boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;

    /**
     * Notification Entity를 DTO로 변환하는 정적 팩토리 메서드
     *
     * @param notification 변환할 Notification 엔티티
     * @return NotificationResponse DTO
     */
    public static NotificationResponse fromEntity(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .type(notification.getType())
                .title(notification.getTitle())
                .content(notification.getContent())
                .relatedData(notification.getRelatedData())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }
}
