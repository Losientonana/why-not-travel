package forproject.spring_oauth2_jwt.cli;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.*;

/**
 * CLI 명령어와 옵션을 파싱하는 클래스
 * Apache Commons CLI를 사용해 Laravel Artisan과 유사한 인터페이스 제공
 */
@Slf4j
public class CliCommandParser {

    private final org.apache.commons.cli.Options options;

    public CliCommandParser() {
        this.options = createOptions();
    }

    /**
     * 사용 가능한 옵션들 정의
     * Laravel Artisan 스타일의 옵션들
     */
    private org.apache.commons.cli.Options createOptions() {
        org.apache.commons.cli.Options opts = new org.apache.commons.cli.Options();

        // --dry-run: 실제 삭제 없이 시뮬레이션만
        opts.addOption(org.apache.commons.cli.Option.builder()
                .longOpt("dry-run")
                .desc("실제 삭제 없이 시뮬레이션만 실행")
                .hasArg(false)
                .build());

        // --threshold: 임계시간 설정 (기본 1시간)
        opts.addOption(org.apache.commons.cli.Option.builder()
                .longOpt("threshold")
                .desc("고아 파일 판단 임계시간 (분 단위, 기본값: 60)")
                .hasArg(true)
                .argName("MINUTES")
                .type(Integer.class)
                .build());

        // --verbose: 상세 로그 출력
        opts.addOption(org.apache.commons.cli.Option.builder("v")
                .longOpt("verbose")
                .desc("상세한 실행 과정 출력")
                .hasArg(false)
                .build());

        // --help: 도움말
        opts.addOption(org.apache.commons.cli.Option.builder("h")
                .longOpt("help")
                .desc("도움말 출력")
                .hasArg(false)
                .build());

        return opts;
    }

    /**
     * 명령행 인수를 파싱하여 ParsedCommand 객체로 반환
     */
    public ParsedCommand parse(String[] args) throws org.apache.commons.cli.ParseException {
        if (args.length == 0) {
            return new ParsedCommand("web", null, false, 60, false);
        }

        String command = args[0];

        // cleanup:images 명령어가 아니면 웹 모드로 실행
        if (!"cleanup:images".equals(command)) {
            return new ParsedCommand("web", null, false, 60, false);
        }

        // 명령어 옵션 파싱
        String[] optionArgs = new String[args.length - 1];
        System.arraycopy(args, 1, optionArgs, 0, args.length - 1);

        org.apache.commons.cli.CommandLineParser parser = new DefaultParser();
        org.apache.commons.cli.CommandLine cmd = parser.parse(options, optionArgs);

        // 도움말 요청 확인
        if (cmd.hasOption("help")) {
            printHelp();
            return new ParsedCommand("help", cmd, false, 60, false);
        }

        // 옵션 추출
        boolean dryRun = cmd.hasOption("dry-run");
        boolean verbose = cmd.hasOption("verbose");
        int threshold = 60; // 기본값 (분 단위)

        if (cmd.hasOption("threshold")) {
            try {
                threshold = Integer.parseInt(cmd.getOptionValue("threshold"));
                if (threshold < 1) {
                    throw new org.apache.commons.cli.ParseException("threshold는 1분 이상이어야 합니다.");
                }
            } catch (NumberFormatException e) {
                throw new org.apache.commons.cli.ParseException("threshold는 숫자여야 합니다: " + cmd.getOptionValue("threshold"));
            }
        }

        return new ParsedCommand("cleanup", cmd, dryRun, threshold, verbose);
    }

    /**
     * 도움말 출력
     */
    public void printHelp() {
        org.apache.commons.cli.HelpFormatter formatter = new org.apache.commons.cli.HelpFormatter();
        formatter.setWidth(100);

        System.out.println("\n=== 이미지 정리 배치 프로그램 ===");
        System.out.println("\n사용법:");
        System.out.println("  java -jar app.jar cleanup:images [옵션]");
        System.out.println("\n예시:");
        System.out.println("  java -jar app.jar cleanup:images                    # 기본 실행");
        System.out.println("  java -jar app.jar cleanup:images --dry-run          # 시뮬레이션만");
        System.out.println("  java -jar app.jar cleanup:images --threshold=2      # 2시간 이상 된 파일");
        System.out.println("  java -jar app.jar cleanup:images --dry-run -v       # 상세 로그와 함께 시뮬레이션");

        System.out.println("\n옵션:");
        formatter.printOptions(new java.io.PrintWriter(System.out, true), 100, options, 2, 4);
        System.out.println();
    }

    /**
     * 파싱된 명령어 정보를 담는 클래스
     */
    @Getter
    public static class ParsedCommand {
        private final String mode;        // web, cleanup, help
        private final org.apache.commons.cli.CommandLine cmd;    // 파싱된 명령행
        private final boolean dryRun;     // --dry-run 옵션
        private final int threshold;      // --threshold 값
        private final boolean verbose;    // --verbose 옵션

        public ParsedCommand(String mode, org.apache.commons.cli.CommandLine cmd, boolean dryRun, int threshold, boolean verbose) {
            this.mode = mode;
            this.cmd = cmd;
            this.dryRun = dryRun;
            this.threshold = threshold;
            this.verbose = verbose;
        }
    }
}