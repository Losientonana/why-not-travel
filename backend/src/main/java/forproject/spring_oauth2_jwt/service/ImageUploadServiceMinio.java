package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.ImageUploadResponse;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageUploadServiceMinio {

    private final MinioClient minioClient;
    private final ImageProcessingService imageProcessingService;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.endpoint}")
    private String minioEndpoint;

    public ImageUploadResponse uploadImage(MultipartFile file, String purpose) {
        validateFile(file);

        try {
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName != null &&
                    originalFileName.contains(".")
                    ? originalFileName.substring(originalFileName.lastIndexOf("."))
                    : "";
            String uniqueFileName = purpose + "/" + UUID.randomUUID().toString() +
                    fileExtension;

            InputStream inputStream = file.getInputStream();
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(uniqueFileName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            String imageUrl = minioEndpoint + "/" + bucketName + "/" + uniqueFileName;

            log.info("MinIO 업로드 성공: {} -> {}", originalFileName, imageUrl);

            return ImageUploadResponse.builder()
                    .imageUrl(imageUrl)
                    .originalName(originalFileName)
                    .size(file.getSize())
                    .mimeType(file.getContentType())
                    .build();

        } catch (Exception e) {
            log.error("MinIO 업로드 실패: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }

        // 파일 크기 검사 (10MB)
        long maxSize = 10 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("파일 크기가 너무 큽니다. 최대 10MB까지 가능합니다.");
        }

        // 파일 형식 검사
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드 가능합니다.");
        }

        String[] allowedTypes = {"image/jpeg", "image/jpg", "image/png", "image/webp"};
        boolean isAllowedType = false;
        for (String allowedType : allowedTypes) {
            if (contentType.equals(allowedType)) {
                isAllowedType = true;
                break;
            }
        }

        if (!isAllowedType) {
            throw new IllegalArgumentException("지원하지 않는 이미지 형식입니다. JPG, PNG, WEBP만 가능합니다.");
        }
    }

    /**
     * 원본 + 썸네일 업로드 (새 메서드 - 여행 사진용)
     *
     * 동작 흐름:
     * 1. 원본 업로드 → trip_photos/original/uuid.jpg
     * 2. 썸네일 생성 (400×267, 150KB)
     * 3. 썸네일 업로드 → trip_photos/thumbnail/uuid.jpg
     * 4. 두 URL 반환
     *
     * @param file 원본 파일
     * @param purpose 용도 (예: "trip_photos")
     * @return 원본 URL + 썸네일 URL
     */
    public ImageUploadResponse uploadImageWithThumbnail(
            MultipartFile file,
            String purpose
    ) {
        validateFile(file);

        try {
            // UUID 생성 (원본과 썸네일이 같은 이름)
            String uuid = UUID.randomUUID().toString();
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName != null &&
                    originalFileName.contains(".")
                    ? originalFileName.substring(originalFileName.lastIndexOf("."))
                    : "";

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 1단계: 원본 업로드
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            String originalPath = purpose + "/original/" + uuid + fileExtension;
            InputStream originalStream = file.getInputStream();

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(originalPath)
                            .stream(originalStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            String originalUrl = minioEndpoint + "/" + bucketName + "/" + originalPath;
            log.info("원본 업로드 완료: {}", originalUrl);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 2단계: 썸네일 생성
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            byte[] thumbnailBytes = imageProcessingService.createThumbnail(file);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 3단계: 썸네일 업로드
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            String thumbnailPath = purpose + "/thumbnail/" + uuid + ".jpg";
            ByteArrayInputStream thumbnailStream = new ByteArrayInputStream(thumbnailBytes);

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(thumbnailPath)
                            .stream(thumbnailStream, thumbnailBytes.length, -1)
                            .contentType("image/jpeg")
                            .build()
            );

            String thumbnailUrl = minioEndpoint + "/" + bucketName + "/" + thumbnailPath;
            log.info("썸네일 업로드 완료: {}", thumbnailUrl);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 4단계: 응답 생성
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            return ImageUploadResponse.builder()
                    .imageUrl(originalUrl)        // 원본 URL
                    .thumbnailUrl(thumbnailUrl)   // 썸네일 URL
                    .originalName(originalFileName)
                    .size(file.getSize())
                    .mimeType(file.getContentType())
                    .build();

        } catch (Exception e) {
            log.error("이미지 업로드 실패: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
        }
    }
}