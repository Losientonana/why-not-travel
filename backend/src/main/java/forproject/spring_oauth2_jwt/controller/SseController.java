package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.dto.response.NotificationResponse;
import forproject.spring_oauth2_jwt.service.NotificationService;
import forproject.spring_oauth2_jwt.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class SseController {
    private final SseService sseService;
    private final NotificationService notificationService;


    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestHeader(value = "Last-Event-ID", required = false) String lastEventId
    ) {
        Long userId = userPrincipal.getId();
        log.info("SSE 연결 요청 - userId: {}", userId);

        // 1) Emitter 먼저 만들고 반환
        SseEmitter emitter = sseService.createEmitter(userId);

        // 2) 여기서 DB 조회 금지 ❌

        // 3) unread push는 비동기 처리로 빼기
        CompletableFuture.runAsync(() -> {
            notificationService.sendUnreadNotificationsAsync(userId);
        });

        return emitter;
    }


    /**
     * 연결 상태 확인
     * GET /api/notifications/status
     */
    @GetMapping("/status")
    public Map<String, Object> getStatus(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        return Map.of(
                "connected", sseService.isConnected(userId),
                "totalConnections", sseService.getConnectionCount()
        );
    }

    /**
     * 알림 읽음 처리
     * PUT /api/notifications/{id}/read
     */
    @PutMapping("/{id}/read")
    public Map<String, String> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return Map.of("message", "알림을 읽음 처리했습니다.");
    }

    /**
     * 읽지 않은 알림 개수
     * GET /api/notifications/count
     */
    @GetMapping("/count")
    public Map<String, Long> getUnreadCount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        long count = notificationService.getUnreadCount(userId);
        return Map.of("count", count);
    }

    /**
     * 읽지 않은 알림 목록 조회 (DTO 반환)
     * GET /api/notifications/unread
     * OSIV=false 환경에서 안전하게 사용 가능
     */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        List<NotificationResponse> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * 읽지 않은 알림 개수 조회
     * GET /api/notifications/unread/count
     */
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadNotificationCount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }
}
