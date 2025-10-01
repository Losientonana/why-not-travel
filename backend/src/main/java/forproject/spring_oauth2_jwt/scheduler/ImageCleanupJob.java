package forproject.spring_oauth2_jwt.scheduler;

import forproject.spring_oauth2_jwt.service.ImageCleanupService;
import lombok.extern.slf4j.Slf4j;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


/**
 * Quartz에서 실행되는 실제 Job 클래스
 *
 * @DisallowConcurrentExecution: 동시 실행 방지
 * - 이전 작업이 완료되기 전에 새 작업이 시작되는 것을 방지
 * - 파일 삭제 작업에서 매우 중요한 안전장치
 */

@Slf4j
@Component
@DisallowConcurrentExecution
public class ImageCleanupJob implements Job {

    private final ImageCleanupService imageCleanupService;

    public ImageCleanupJob(ImageCleanupService imageCleanupService) {
        this.imageCleanupService = imageCleanupService;
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {

        String jobName = context.getJobDetail().getKey().getName();
        String triggerName = context.getTrigger().getKey().getName();
        LocalDateTime startTime = LocalDateTime.now();

        log.info("┌─────────────────────────────────────────┐");
        log.info("│        이미지 정리 배치 시작                 │");
        log.info("└─────────────────────────────────────────┘");
        log.info("실행 정보:");
        log.info("  - Job: {}", jobName);
        log.info("  - Trigger: {}", triggerName);
        log.info("  - 시작 시간: {}", startTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        try {
            // 실제 정리 작업 실행
            ImageCleanupService.CleanupResult result = imageCleanupService.performCleanup();

            LocalDateTime endTime = LocalDateTime.now();
            long durationMillis = java.time.Duration.between(startTime, endTime).toMillis();

            log.info("┌─────────────────────────────────────────┐");
            log.info("│        이미지 정리 배치 완료            │");
            log.info("└─────────────────────────────────────────┘");
            log.info("실행 결과:");
            log.info("  - 검사된 파일: {}개", result.getScannedCount());
            log.info("  - 삭제된 파일: {}개", result.getDeletedCount());
            log.info("  - 오류 발생: {}개", result.getErrorCount());
            log.info("  - 소요 시간: {}ms", durationMillis);
            log.info("  - 완료 시간: {}", endTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            // 오류가 있었다면 경고 로그
            if (result.getErrorCount() > 0) {
                log.warn("⚠️  일부 파일 처리 중 {}개의 오류가 발생했습니다.", result.getErrorCount());
                result.getErrorFiles().forEach(file -> log.warn("  오류 파일: {}", file));
            }

        } catch (Exception e) {
            log.error("💥 이미지 정리 배치 실행 중 심각한 오류 발생", e);

            // Quartz에게 실패를 알리고 재실행하지 않도록 설정
            JobExecutionException jobException = new JobExecutionException(e);
            jobException.setRefireImmediately(false);
            throw jobException;
        }
    }
}
