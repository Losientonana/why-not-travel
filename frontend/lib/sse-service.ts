import { AppNotification } from './types';
import { tokenManager } from './api';

type SSEEventHandler = (notification: AppNotification) => void;

/**
 * SSE 연결 관리 서비스 (fetch 기반)
 * EventSource는 커스텀 헤더를 보낼 수 없어서 fetch + ReadableStream 사용
 */
class SSEService {
  private abortController: AbortController | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private handlers: Set<SSEEventHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3초
  private isConnecting = false;

  /**
   * SSE 연결 시작 (fetch 사용)
   */
  connect(): void {
    if (this.isConnecting) {
      console.log('⚠️ [SSE] 이미 연결 중입니다.');
      return;
    }

    const token = tokenManager.getAccessToken();
    if (!token) {
      console.log('⚠️ [SSE] Access 토큰이 없어 연결하지 않습니다.');
      return;
    }

    this.isConnecting = true;
    this.abortController = new AbortController();

    const baseURL = process.env.NEXT_PUBLIC_API_URL
      // const baseURL = "http://localhost:8080"
    const url = `${baseURL}/api/notifications/stream`;

    console.log('🔌 [SSE] 연결 시작...', url);

    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'access': token, // 백엔드 JWTFilter가 access 헤더를 읽음
      },
      credentials: 'include',
      signal: this.abortController.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        console.log('✅ [SSE] 연결 성공');
        this.reconnectAttempts = 0;
        this.isConnecting = false;

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('Response body is null');
        }

        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log('🔌 [SSE] 연결 종료됨');
            this.handleConnectionError();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            this.processLine(line);
          }
        }
      })
      .catch((error) => {
        console.error('❌ [SSE] 연결 오류:', error);
        this.isConnecting = false;
        if (error.name !== 'AbortError') {
          this.handleConnectionError();
        }
      });
  }

  /**
   * SSE 메시지 한 줄 처리
   */
  private currentEvent: { id?: string; event?: string; data?: string } = {};

  private processLine(line: string): void {
    if (line.startsWith('id:')) {
      this.currentEvent.id = line.substring(3).trim();
    } else if (line.startsWith('event:')) {
      this.currentEvent.event = line.substring(6).trim();
    } else if (line.startsWith('data:')) {
      this.currentEvent.data = line.substring(5).trim();
    } else if (line === '') {
      // 빈 줄은 이벤트 종료를 의미
      if (this.currentEvent.data) {
        this.handleEvent(this.currentEvent);
      }
      this.currentEvent = {};
    }
  }

  /**
   * SSE 이벤트 처리
   */
  private handleEvent(event: { id?: string; event?: string; data?: string }): void {
    const eventType = event.event || 'message';

    console.log(`📨 [SSE] 이벤트 수신 - type: ${eventType}, data:`, event.data);

    // keepalive는 무시
    if (eventType === 'keepalive') {
      console.log('💓 [SSE] Keepalive');
      return;
    }

    // 알림 이벤트 처리
    if (event.data && (eventType === 'invitation' || eventType === 'trip_update' || eventType === 'system')) {
      try {
        const notification: AppNotification = JSON.parse(event.data);
        this.handlers.forEach(handler => {
          try {
            handler(notification);
          } catch (error) {
            console.error('❌ [SSE] 핸들러 실행 오류:', error);
          }
        });
      } catch (error) {
        console.error('❌ [SSE] 알림 파싱 실패:', event.data, error);
      }
    }
  }

  /**
   * 연결 오류 처리 및 재연결
   */
  private handleConnectionError(): void {
    this.disconnect();

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 [SSE] ${this.reconnectDelay}ms 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.error('❌ [SSE] 최대 재연결 시도 횟수 초과');
    }
  }

  /**
   * SSE 연결 종료
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.abortController) {
      console.log('🔌 [SSE] 연결 종료');
      this.abortController.abort();
      this.abortController = null;
    }

    this.isConnecting = false;
  }

  /**
   * 알림 이벤트 핸들러 등록
   */
  subscribe(handler: SSEEventHandler): () => void {
    this.handlers.add(handler);
    console.log(`✅ [SSE] 핸들러 등록 (총 ${this.handlers.size}개)`);

    return () => {
      this.handlers.delete(handler);
      console.log(`🗑️ [SSE] 핸들러 제거 (남은 개수: ${this.handlers.size}개)`);
    };
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.abortController !== null && !this.abortController.signal.aborted;
  }

  /**
   * 재연결 시도 횟수 초기화
   */
  resetReconnectAttempts(): void {
    this.reconnectAttempts = 0;
  }
}

// 싱글톤 인스턴스 export
export const sseService = new SSEService();
