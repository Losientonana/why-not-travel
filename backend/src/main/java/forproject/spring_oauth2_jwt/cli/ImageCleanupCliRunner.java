package forproject.spring_oauth2_jwt.cli;

import forproject.spring_oauth2_jwt.service.ImageCleanupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Spring Boot CommandLineRunner를 구현한 CLI 실행기
 *
 * Spring Boot 애플리케이션이 시작될 때 run() 메서드가 자동 호출됨
 * 명령행 인수를 분석해서 CLI 모드인지 웹 모드인지 결정
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ImageCleanupCliRunner implements CommandLineRunner {

    private final ImageCleanupService imageCleanupService;

    /**
     * Spring Boot가 애플리케이션 시작 후 자동으로 호출하는 메서드
     *
     * @param args 명령행에서 전달받은 인수들 (java -jar app.jar 뒤의 모든 인수)
     */
    @Override
    public void run(String... args) throws Exception {
        CliCommandParser parser = new CliCommandParser();

        try {
            // 명령행 인수 파싱
            CliCommandParser.ParsedCommand parsedCommand = parser.parse(args);

            switch (parsedCommand.getMode()) {
                case "web":
                    // 웹 모드: 아무것도 하지 않고 Spring Boot 웹 애플리케이션으로 계속 실행
                    log.info("웹 애플리케이션 모드로 시작됩니다.");
                    // Quartz 스케줄러가 자동으로 시작되어 매일 오전 3시에 실행됨
                    return;

                case "help":
                    // 도움말 출력 후 종료
                    System.exit(0);

                case "cleanup":
                    // CLI 정리 모드: 즉시 정리 작업 실행 후 종료
                    executeCleanupCommand(parsedCommand);
                    System.exit(0);

                default:
                    log.error("알 수 없는 모드: {}", parsedCommand.getMode());
                    System.exit(1);
            }

        } catch (Exception e) {
            log.error("CLI 명령어 처리 중 오류 발생", e);
            System.err.println("오류: " + e.getMessage());
            parser.printHelp();
            System.exit(1);
        }
    }

    /**
     * 실제 정리 명령어 실행
     */
    private void executeCleanupCommand(CliCommandParser.ParsedCommand command) {
        LocalDateTime startTime = LocalDateTime.now();

        // 실행 정보 출력
        printExecutionHeader(command, startTime);

        try {
            ImageCleanupService.CleanupResult result;

            if (command.isDryRun()) {
                // DRY RUN 모드: 시뮬레이션만
                log.info("🔍 DRY RUN 모드: 실제로 파일을 삭제하지 않습니다.");
                result = imageCleanupService.performDryRun(command.getThreshold());
            } else {
                // 실제 실행 모드
                log.info("🗑️  실제 정리 작업을 실행합니다.");
                result = imageCleanupService.performCleanup(command.getThreshold());
            }

            // 결과 출력
            printExecutionResult(result, command, startTime);

        } catch (Exception e) {
            log.error("정리 작업 실행 중 오류 발생", e);
            System.err.println("❌ 실행 실패: " + e.getMessage());
            System.exit(1);
        }
    }

    /**
     * 실행 시작 정보 출력
     */
    private void printExecutionHeader(CliCommandParser.ParsedCommand command, LocalDateTime startTime) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("🧹 이미지 정리 배치 프로그램");
        System.out.println("=".repeat(60));
        System.out.println("📅 실행 시간: " + startTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        System.out.println("⚙️  실행 모드: " + (command.isDryRun() ? "DRY RUN (시뮬레이션)" : "실제 실행"));
        System.out.println("⏰ 임계 시간: " + command.getThreshold() + "시간");
        System.out.println("📝 상세 로그: " + (command.isVerbose() ? "활성화" : "비활성화"));
        System.out.println("=".repeat(60));
    }

    /**
     * 실행 결과 출력
     */
    private void printExecutionResult(ImageCleanupService.CleanupResult result,
                                      CliCommandParser.ParsedCommand command,
                                      LocalDateTime startTime) {
        LocalDateTime endTime = LocalDateTime.now();
        long durationMs = java.time.Duration.between(startTime, endTime).toMillis();

        System.out.println("\n" + "=".repeat(60));
        System.out.println("📊 실행 결과");
        System.out.println("=".repeat(60));
        System.out.println("🔍 검사된 파일:   " + result.getScannedCount() + "개");

        if (command.isDryRun()) {
            System.out.println("🗑️  삭제 예정 파일: " + result.getDeletedCount() + "개");
        } else {
            System.out.println("✅ 삭제된 파일:   " + result.getDeletedCount() + "개");
        }

        System.out.println("❌ 오류 발생:     " + result.getErrorCount() + "개");
        System.out.println("⏱️  소요 시간:     " + durationMs + "ms");
        System.out.println("🏁 완료 시간:     " + endTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        // 상세 정보 출력 (verbose 옵션 시)
        if (command.isVerbose()) {
            printDetailedResult(result, command);
        }

        System.out.println("=".repeat(60));

        // 요약 메시지
        if (command.isDryRun()) {
            System.out.println("✨ DRY RUN 완료: " + result.getDeletedCount() + "개 파일이 삭제 예정입니다.");
            if (result.getDeletedCount() > 0) {
                System.out.println("💡 실제 삭제하려면 --dry-run 옵션을 제거하고 다시 실행하세요.");
            }
        } else {
            System.out.println("✨ 정리 완료: " + result.getDeletedCount() + "개 파일이 삭제되었습니다.");
        }
    }

    /**
     * 상세 결과 출력 (--verbose 옵션 시)
     */
    private void printDetailedResult(ImageCleanupService.CleanupResult result,
                                     CliCommandParser.ParsedCommand command) {
        if (!result.getDeletedFiles().isEmpty()) {
            System.out.println("\n📋 " + (command.isDryRun() ? "삭제 예정" : "삭제된") + " 파일 목록:");
            result.getDeletedFiles().forEach(file ->
                    System.out.println("  • " + file)
            );
        }

        if (!result.getErrorFiles().isEmpty()) {
            System.out.println("\n⚠️  오류 발생 파일 목록:");
            result.getErrorFiles().forEach(file ->
                    System.out.println("  • " + file)
            );
        }
    }
}