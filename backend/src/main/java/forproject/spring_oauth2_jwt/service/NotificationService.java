package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.response.NotificationResponse;
import forproject.spring_oauth2_jwt.entity.Notification;
import forproject.spring_oauth2_jwt.entity.TravelInvitation;
import forproject.spring_oauth2_jwt.entity.TravelPlanEntity;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.enums.InvitationStatus;
import forproject.spring_oauth2_jwt.enums.NotificationType;
import forproject.spring_oauth2_jwt.repository.NotificationRepository;
import forproject.spring_oauth2_jwt.repository.TravelInvitationRepository;
import forproject.spring_oauth2_jwt.repository.TravelPlanRepository;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SseService sseService;
    private final TravelPlanRepository travelPlanRepository;
    private final TravelInvitationRepository travelInvitationRepository;
    private final UserRepository userRepository;

    /**
     * 알림 생성 및 실시간 전송(sendRealTime 호출)
     */
    @Transactional
    public Notification createAndSend(Long userId, NotificationType type,
                                      String title, String content, String relatedData) {

        // 1. DB에 알림 저장
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .content(content)
                .relatedData(relatedData)
                .isRead(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        log.info("✅ 알림 DB 저장 완료 - userId: {}, notificationId: {}, type: {}",
                userId, saved.getId(), type);

        // 2. SSE 연결 확인 후 실시간 전송
        sendRealtime(saved);
        return saved;
    }

    public void sendRealtime(Notification notification) {
        if (sseService.isConnected(notification.getUserId())) {
            String eventId =  "notif-" + notification.getId();
            // DTO로 변환해서 전송
            NotificationResponse dto = NotificationResponse.fromEntity(notification);
            sseService.sendWithId(
                    notification.getUserId(),
                    eventId,
                    notification.getType().name().toLowerCase(),
                    dto
            );
            log.info("실시간 SSE 전송 완료 - userId: {}, notificationId: {}", notification.getUserId(), notification.getId());
        }else {
            log.info("⏳ 사용자 오프라인 - 로그인 시 전송 예정 - userId: {}",
                    notification.getUserId());
        }
    }

    /**
     * 읽지 않은 알림 목록 조회 (DTO 반환)
     * OSIV=false 환경에서 안전하게 사용 가능
     */
    @Transactional
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 알림 읽음 처리
     * @param id
     */
    @Transactional
    public void markAsRead(Long id){
        Notification byId = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("not found"));
        byId.setRead(true);
        byId.setReadAt(LocalDateTime.now());

    }

    /**
     * 읽지 않은 알림 개수
     * @param userId
     * @return
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }


    /**
     * 특정 relatedData의 알림을 읽음 처리
     */
    @Transactional
    public void markAsReadByRelatedData(Long userId, String relatedData) {
        List<Notification> notifications = notificationRepository
                .findByUserIdAndRelatedData(userId, relatedData);

        for (Notification notification : notifications) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        }

        if (!notifications.isEmpty()) {
            log.info("✅ 관련 알림 읽음 처리 완료 - userId: {}, relatedData: {}, 개수: {}",
                    userId, relatedData, notifications.size());
        }
    }

    /**
     * 읽지 않은 알림을 비동기로 SSE 전송
     * OSIV=false 환경에서 안전하게 사용 가능 (DTO 변환)
     */
    @Transactional
    @Async("sseTaskExecutor")
    public void sendUnreadNotificationsAsync(Long userId) {
        List<Notification> list = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        for (Notification n : list) {
            // DTO로 변환해서 전송 (Lazy Loading 방지)
            NotificationResponse dto = NotificationResponse.fromEntity(n);
            sseService.sendWithId(
                    userId,
                    "notif-" + n.getId(),
                    n.getType().name().toLowerCase(),
                    dto
            );
        }
    }

    /**
     * 비회원이 가입한 후 pending 초대에 대한 알림 일괄 생성
     * @param userId 가입한 사용자 ID
     * @param email 가입한 사용자 이메일
     */
    @Transactional
    public void createNotificationsForPendingInvitations(Long userId, String email) {
        log.info("🔔 가입 후 초대 알림 생성 시작 - userId: {}, email: {}", userId, email);

        // 이 이메일로 온 PENDING 초대 조회
        List<TravelInvitation> pendingInvitations = travelInvitationRepository
                .findByInvitedEmailAndStatus(email, InvitationStatus.PENDING);

        if (pendingInvitations.isEmpty()) {
            log.info("⏭️ pending 초대 없음 - email: {}", email);
            return;
        }

        log.info("📨 처리할 pending 초대 개수: {}", pendingInvitations.size());

        for (TravelInvitation invitation : pendingInvitations) {
            try {
                // TravelInvitation의 userId 업데이트
                invitation.setUserId(userId);
                travelInvitationRepository.save(invitation);

                // 여행 정보 조회
                TravelPlanEntity trip = travelPlanRepository.findById(invitation.getTripId())
                        .orElse(null);

                // 초대자 정보 조회
                UserEntity inviter = userRepository.findById(invitation.getInviterId())
                        .orElse(null);

                if (trip != null && inviter != null) {
                    // 알림 생성
                    createAndSend(
                            userId,
                            NotificationType.INVITATION,
                            "여행 초대",
                            String.format("%s님이 '%s' 여행에 초대했습니다.",
                                    inviter.getName(), trip.getTitle()),
                            invitation.getToken()
                    );

                    log.info("✅ 가입 후 알림 생성 완료 - invitationId: {}, tripId: {}",
                            invitation.getId(), invitation.getTripId());
                } else {
                    log.warn("⚠️ 여행 또는 초대자 정보 없음 - invitationId: {}", invitation.getId());
                }
            } catch (Exception e) {
                log.error("❌ 가입 후 알림 생성 실패 - invitationId: {}, error: {}",
                        invitation.getId(), e.getMessage());
            }
        }

        log.info("🎉 가입 후 초대 알림 생성 완료 - 생성된 알림 수: {}", pendingInvitations.size());
    }

}
