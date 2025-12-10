package forproject.spring_oauth2_jwt.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class SseService {

    // userId->SseEmitter 매핑 구조
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    //타임아웃 설정
    private static final Long DEFAULT_TIMEOUT = 30 * 60 * 1000L;

    /**
     * 연결 생성과 sse통신 객체를 유저와 객체에 맞춰서 MAP에 등록
     */
    public SseEmitter createEmitter(Long userId) {
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);

        // 연결 성공 시 더미 이벤트 전송 (연결 확인용)
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("SSE 연결 성공"));
        } catch (IOException e) {
            log.error("연결 초기 이벤트 전송 실패: userId={}", userId);
            throw new RuntimeException("SSE 연결 실패");
        }

        // 연결 등록
        emitters.put(userId, emitter);
        log.info("✅ SSE 연결 등록: userId={}, 현재 연결 수: {}", userId, emitters.size());

        // 콜백 등록
        emitter.onCompletion(() -> {
            emitters.remove(userId);
            log.info("SSE 연결 정상 종료: userId={}", userId);
        });

        emitter.onTimeout(() -> {
            emitters.remove(userId);
            log.warn("SSE 연결 타임아웃: userId={}", userId);
        });

        emitter.onError((ex) -> {
            emitters.remove(userId);
            log.error("SSE 연결 에러: userId={}, error={}", userId, ex.getMessage());
        });

        return emitter;
    }

    /**
     * ID와 함께 이벤트 전송 (재연결 지원)
     */
    public void sendWithId(Long userId, String eventId, String eventName, Object data) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter == null) {
            log.warn("⚠️ SSE 연결 없음: userId={}", userId);
            return;
        }
        try{
            emitter.send(SseEmitter.event()
                    .id(eventId)
                    .name(eventName)
                    .data(data));
            log.info("✅ SSE 이벤트 전송 (ID: {}): userId={}, eventName={}", eventId, userId, eventName);
        } catch (IOException e) {
            emitters.remove(userId);
            log.error("❌ SSE 전송 실패: userId={}", userId);
        }
    }

    /**
     * 연결 여부 확인
     */
    public boolean isConnected(Long userId) {
        return emitters.containsKey(userId);
    }

    /**
     * 현재 연결 수
     */
    public int getConnectionCount() {
        return emitters.size();
    }

    /**
     * 연결 강제 종료
     */
    public void disconnect(Long userId) {
        SseEmitter emitter = emitters.remove(userId);
        if (emitter != null) {
            emitter.complete();
            log.info("SSE 연결 강제 종료: userId={}", userId);
        }
    }
}
