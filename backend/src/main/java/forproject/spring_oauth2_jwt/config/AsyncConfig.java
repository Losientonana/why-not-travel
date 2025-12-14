package forproject.spring_oauth2_jwt.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * 비동기 처리 설정
 *
 * 외부 I/O(이메일 전송, SSE 알림)를 트랜잭션에서 분리하여
 * 데이터베이스 커넥션 풀 고갈을 방지하고 응답 속도를 개선
 */
@Slf4j
@Configuration
@EnableAsync
public class AsyncConfig {

    /**
     * 이메일 전송 전용 스레드 풀
     *
     * - corePoolSize: 2 (기본 스레드 2개)
     * - maxPoolSize: 5 (최대 스레드 5개)
     * - queueCapacity: 100 (큐 용량 100개)
     *
     * 설계 근거:
     * - 이메일 전송은 외부 SMTP 서버와의 네트워크 I/O로 시간이 오래 걸림
     * - 초대 기능에서 동시에 여러 이메일을 보낼 수 있음
     * - 큐 용량을 크게 설정하여 트래픽 폭증 시에도 요청을 버퍼링
     */
    @Bean(name = "emailTaskExecutor")
    public Executor emailTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("Email-Async-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(60);
        executor.initialize();

        log.info("✅ Email 비동기 스레드 풀 초기화 완료 - Core: 2, Max: 5, Queue: 100");
        return executor;
    }

    /**
     * SSE 알림 전용 스레드 풀
     *
     * - corePoolSize: 3 (기본 스레드 3개)
     * - maxPoolSize: 10 (최대 스레드 10개)
     * - queueCapacity: 200 (큐 용량 200개)
     *
     * 설계 근거:
     * - SSE는 실시간 알림으로 이메일보다 빈번하게 발생
     * - 여러 사용자가 동시에 알림을 받을 수 있음
     * - 네트워크 I/O이지만 이메일보다는 빠르게 처리됨
     * - 큐 용량을 더 크게 설정하여 동시성 처리 능력 향상
     */
    @Bean(name = "sseTaskExecutor")
    public Executor sseTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(3);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(200);
        executor.setThreadNamePrefix("SSE-Async-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        executor.initialize();

        log.info("✅ SSE 비동기 스레드 풀 초기화 완료 - Core: 3, Max: 10, Queue: 200");
        return executor;
    }
}
