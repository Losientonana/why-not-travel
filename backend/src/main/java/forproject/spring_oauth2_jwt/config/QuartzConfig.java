package forproject.spring_oauth2_jwt.config;


import forproject.spring_oauth2_jwt.scheduler.ImageCleanupJob;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.CodePointLength;
import org.quartz.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**\
 * QuartzConfig의 용도는 내가 만든 Job을 언제 어떻게 실행할건지 설정
 */

@Slf4j
@Configuration
@ConditionalOnProperty(
        name = "app.mode",
        havingValue = "web",
        matchIfMissing = true //기본값은 web 모드
)
public class QuartzConfig {

    /**
     * JobDetail Bean 생성
     *
     * JobDetail은 실행할 작업의 정의를 담고 있는 객체입니다.
     * - 어떤 Job 클래스를 실행할지
     * - Job의 식별자(이름, 그룹)
     * - Job 실행시 전달할 데이터 등을 정의
     */

    @Bean
    public JobDetail imageCleanupJobDetail(){
        log.info("이미지 정리 JobDetail 생성");

        return JobBuilder.newJob(ImageCleanupJob.class)
                .withIdentity("imageCleanupJob","maintenanceGroup") // job 식별자
                .withDescription("고아 이미지 파일 정리 작업") // 작업 설명
                .storeDurably(true) // 스케줄러가 없어도 job 정의를 유지
                .requestRecovery(true) //시스템 장애시 재실행 여부
                .build();
    }

    /**
     * Trigger Bean 생성 - 자동 실행용
     *
     * Trigger는 Job이 언제 실행될지를 정의합니다.
     * CronTrigger는 cron 표현식을 사용해 복잡한 스케줄을 정의할 수 있습니다.
     */

    @Bean
    public Trigger imageCleanupTrigger() {
        log.info("이미지 정리 자동 스케줄 Trigger 생성 - 매일 오전 3시");

        return TriggerBuilder.newTrigger()
                .forJob(imageCleanupJobDetail())  // 어떤 Job을 실행할지
                .withIdentity("imageCleanupTrigger", "maintenanceGroup")  // Trigger 식별자
                .withDescription("매일 오전 3시 이미지 정리 실행")
                .withSchedule(
                        CronScheduleBuilder.cronSchedule("0 0 3 * * ?")  // cron: 초 분 시 일 월 요일
                                .withMisfireHandlingInstructionDoNothing()  // 놓친 실행은 무시
                )
                .startNow()  // 스케줄러 시작시 바로 활성화
                .build();
    }
}
