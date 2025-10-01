package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.repository.TravelPlanRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageCleanupService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private final TravelPlanRepository travelPlanRepository;

    /**
     * 실제 정리 작업 수행 (기본 임계시간 60분)
     */
    public CleanupResult performCleanup() {
        return performCleanup(60);
    }

    /**
     * 실제 정리 작업 수행 (커스텀 임계시간)
     */
    public CleanupResult performCleanup(int thresholdMinutes) {
        log.info("🧹 이미지 정리 작업 시작 - 디렉토리: {}, 임계시간: {}분", uploadDir, thresholdMinutes);

        CleanupResult result = new CleanupResult();

        try {
            Path uploadPath = Paths.get(uploadDir);

            // 업로드 디렉토리 존재 확인
            if (!Files.exists(uploadPath)) {
                log.warn("⚠️  업로드 디렉토리가 존재하지 않음: {}", uploadPath);
                return result;
            }

            // 1단계: 모든 이미지 파일 스캔
            List<Path> allImageFiles = scanAllImageFiles(uploadPath);
            result.scannedCount = allImageFiles.size();
            log.info("📁 전체 이미지 파일 {}개 발견", allImageFiles.size());

            // 2단계: 고아 파일 식별
            List<Path> orphanedFiles = identifyOrphanedFiles(allImageFiles, thresholdMinutes);
            log.info("🎯 고아 파일 {}개 식별", orphanedFiles.size());

            // 3단계: 실제 삭제
            result.deletedCount = deleteOrphanedFiles(orphanedFiles, result);

            log.info("✅ 이미지 정리 완료 - 검사: {}개, 삭제: {}개, 오류: {}개",
                    result.scannedCount, result.deletedCount, result.errorCount);

        } catch (Exception e) {
            log.error("💥 이미지 정리 중 예상치 못한 오류", e);
            result.errorCount++;
        }

        return result;
    }

    /**
     * DRY RUN 모드 - 실제 삭제 없이 시뮬레이션만
     */
    public CleanupResult performDryRun(int thresholdMinutes) {
        log.info("🔍 DRY RUN 모드로 이미지 정리 시뮬레이션 시작 - 임계시간: {}분", thresholdMinutes);

        CleanupResult result = new CleanupResult();

        try {
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                log.warn("⚠️  업로드 디렉토리가 존재하지 않음: {}", uploadPath);
                return result;
            }

            // 파일 스캔
            List<Path> allImageFiles = scanAllImageFiles(uploadPath);
            result.scannedCount = allImageFiles.size();
            log.info("📁 전체 이미지 파일 {}개 발견", allImageFiles.size());

            // 고아 파일 식별 (삭제는 하지 않음)
            List<Path> orphanedFiles = identifyOrphanedFiles(allImageFiles, thresholdMinutes);
            result.deletedCount = orphanedFiles.size(); // 삭제 예정 개수

            // 삭제 예정 파일 목록만 기록
            orphanedFiles.forEach(file -> {
                String fileName = file.getFileName().toString();
                result.deletedFiles.add(fileName);
                log.debug("🗑️  삭제 예정: {}", fileName);
            });

            log.info("🔍 DRY RUN 완료 - 검사: {}개, 삭제 예정: {}개",
                    result.scannedCount, result.deletedCount);

        } catch (Exception e) {
            log.error("💥 DRY RUN 중 오류", e);
            result.errorCount++;
        }

        return result;
    }

    /**
     * 모든 이미지 파일 스캔
     */
    private List<Path> scanAllImageFiles(Path uploadPath) throws IOException {
        List<Path> imageFiles = new ArrayList<>();

        try (Stream<Path> files = Files.walk(uploadPath, FileVisitOption.FOLLOW_LINKS)) {
            files.filter(Files::isRegularFile)
                    .filter(this::isImageFile)
                    .forEach(imageFiles::add);
        }

        log.debug("📂 {} 디렉토리에서 {}개 이미지 파일 발견", uploadPath, imageFiles.size());
        return imageFiles;
    }

    /**
     * 이미지 파일인지 확인
     */
    private boolean isImageFile(Path file) {
        String fileName = file.getFileName().toString().toLowerCase();
        return fileName.endsWith(".jpg") ||
                fileName.endsWith(".jpeg") ||
                fileName.endsWith(".png") ||
                fileName.endsWith(".webp") ||
                fileName.endsWith(".gif");
    }

    /**
     * 고아 파일 식별
     *
     * 고아 파일 조건:
     * 1. 생성된지 임계시간 이상 지남
     * 2. 데이터베이스에서 참조되지 않음
     */
    private List<Path> identifyOrphanedFiles(List<Path> allFiles, int thresholdMinutes) {
        List<Path> orphanedFiles = new ArrayList<>();
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(thresholdMinutes);

        log.debug("⏰ 임계 시간: {} ({}분 전)", threshold, thresholdMinutes);

        for (Path file : allFiles) {
            try {
                // 파일 생성 시간 확인
                LocalDateTime fileTime = LocalDateTime.ofInstant(
                        Files.getLastModifiedTime(file).toInstant(),
                        ZoneId.systemDefault()
                );

                // 임계시간 이전에 생성된 파일만 검사
                if (fileTime.isBefore(threshold)) {
                    String fileName = file.getFileName().toString();

                    // 데이터베이스에서 사용 여부 확인
                    if (!isFileUsedInDatabase(fileName)) {
                        orphanedFiles.add(file);
                        log.debug("🎯 고아 파일 발견: {} (생성: {})", fileName, fileTime);
                    } else {
                        log.debug("✅ 사용중인 파일: {} (생성: {})", fileName, fileTime);
                    }
                } else {
                    log.debug("⏭️  최근 파일 건너뛰기: {} (생성: {})", file.getFileName(), fileTime);
                }

            } catch (IOException e) {
                log.warn("⚠️  파일 시간 확인 실패: {}", file, e);
            }
        }

        return orphanedFiles;
    }

    /**
     * 데이터베이스에서 파일 사용 여부 확인
     */
    private boolean isFileUsedInDatabase(String fileName) {
        try {
            // TravelPlanEntity 테이블에서 이미지 URL에 파일명이 포함된 레코드 검색
            long count = travelPlanRepository.countByImageUrlContaining(fileName);

            if (count > 0) {
                log.debug("🔗 파일 사용중: {} (참조 개수: {})", fileName, count);
                return true;
            }

            log.debug("🔍 파일 미사용: {}", fileName);
            return false;

        } catch (Exception e) {
            log.error("💥 데이터베이스 검색 오류: {}", fileName, e);
            // 오류시 안전하게 사용중으로 간주 (삭제하지 않음)
            return true;
        }
    }

    /**
     * 고아 파일들을 안전하게 삭제
     */
    private int deleteOrphanedFiles(List<Path> orphanedFiles, CleanupResult result) {
        int deletedCount = 0;

        for (Path file : orphanedFiles) {
            try {
                String fileName = file.getFileName().toString();

                // 삭제 직전 마지막 검증 (double-check)
                if (!isFileUsedInDatabase(fileName)) {

                    // 파일 삭제 실행
                    Files.delete(file);
                    deletedCount++;

                    log.info("🗑️  파일 삭제 완료: {}", fileName);
                    result.deletedFiles.add(fileName);

                } else {
                    log.warn("⚠️  삭제 직전 데이터베이스에서 사용 발견: {}", fileName);
                }

            } catch (IOException e) {
                log.error("❌ 파일 삭제 실패: {}", file, e);
                result.errorCount++;
                result.errorFiles.add(file.getFileName().toString());
            } catch (Exception e) {
                log.error("💥 예상치 못한 삭제 오류: {}", file, e);
                result.errorCount++;
                result.errorFiles.add(file.getFileName().toString());
            }
        }

        return deletedCount;
    }

    /**
     * 정리 작업 결과를 담는 클래스
     */
    @Getter
    public static class CleanupResult {
        private int scannedCount = 0;      // 검사된 파일 수
        private int deletedCount = 0;      // 삭제된 파일 수
        private int errorCount = 0;        // 오류 발생 파일 수
        private List<String> deletedFiles = new ArrayList<>();  // 삭제된 파일 목록
        private List<String> errorFiles = new ArrayList<>();    // 오류 발생 파일 목록
        private LocalDateTime executedAt = LocalDateTime.now(); // 실행 시간
    }
}