package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    /**
     * 사용자의 읽지 않은 알림 개수
     */
    long countByUserIdAndIsReadFalse(Long userId);

    /**
     *  사용자의 모든 알림 조회 (최신순)
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * 사용자의 읽지 않은 알림 조회 (최신순)
     */
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    /**
     * Last-Event-ID 이후 조회
     */
    List<Notification> findByUserIdAndIdGreaterThanOrderByCreatedAtAsc(Long userId, Long lastNotificationId);

    /**
     * 특정 초대와 연결된 알림 조회
     */
    List<Notification> findByUserIdAndRelatedData(Long userId, String relatedData);
}
