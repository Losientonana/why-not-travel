/**\
 *
 * 현재 스케줄링 구현에 대한 방식에 대해거는 보류중임
 */

//package forproject.spring_oauth2_jwt.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Table(name = "scheduler_job")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class SchedulerJobEntity {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    /**
//     * 작업 고유 이름
//     */
//    @Column(name = "job_name", length = 100, nullable = false, unique = true)
//    private String jobName;
//
//    /**
//     * 실행할 Spring Bean의 이름
//     */
//    @Column(name = "job_class", length = 255, nullable = false)
//    private String jobClass;
//
//    /**
//     * 스케줄 타입 (실행 주기)
//     * - DAILY: 매일 실행
//     * - HOURLY: 매시간 실행
//     * - EVERY_30_MINUTES: 30분마다 실행
//     * - EVERY_10_MINUTES: 10분마다 실행
//     * - EVERY_5_MINUTES: 5분마다 실행
//     */
//    @Column(name = "schedule_type", length = 50, nullable = false)
//    private String scheduleType;
//
//    @Column(name = "description", columnDefinition = "TEXT")
//    private String description;
//
//    @Column(name = "is_active", nullable = false)
//    @Builder.Default
//    private Boolean isActive = true;
//
//
//}
