package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.ImageUploadResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.Arrays;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private final S3Client s3Client;
    private final ImageProcessingService imageProcessingService;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.base-url}")
    private String baseUrl;

    @Value("${aws.s3.region}")
    private String region;

    public ImageUploadResponse uploadImage(MultipartFile file, String purpose) {
        validateFile(file);

        try {
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName != null && originalFileName.contains(".")
                    ? originalFileName.substring(originalFileName.lastIndexOf("."))
                    : "";

            String uniqueFileName = purpose + "/" + UUID.randomUUID() + fileExtension;

            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(uniqueFileName)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

            String imageUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + uniqueFileName;


            log.info("S3 업로드 성공: {}", imageUrl);

            return ImageUploadResponse.builder()
                    .imageUrl(imageUrl)
                    .originalName(originalFileName)
                    .size(file.getSize())
                    .mimeType(file.getContentType())
                    .build();

        } catch (Exception e) {
            log.error("S3 업로드 실패", e);
            throw new RuntimeException("이미지 업로드 실패", e);
        }
    }

    public ImageUploadResponse uploadImageWithThumbnail(MultipartFile file, String purpose) {
        validateFile(file);

        try {
            String uuid = UUID.randomUUID().toString();
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName.substring(originalFileName.lastIndexOf("."));

            // 1. 원본
            String originalPath = purpose + "/original/" + uuid + extension;

            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(originalPath)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

            // 2. 썸네일 생성
            byte[] thumbnailBytes = imageProcessingService.createThumbnail(file);

            // 3. 썸네일 업로드
            String thumbnailPath = purpose + "/thumbnail/" + uuid + ".jpg";

            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(thumbnailPath)
                            .contentType("image/jpeg")
                            .build(),
                    RequestBody.fromBytes(thumbnailBytes)
            );

//            String originalUrl = baseUrl + "/" + originalPath;
//            String thumbnailUrl = baseUrl + "/" + thumbnailPath;
            String originalUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + originalPath;
            String thumbnailUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + thumbnailPath;


            return ImageUploadResponse.builder()
                    .imageUrl(originalUrl)
                    .thumbnailUrl(thumbnailUrl)
                    .originalName(originalFileName)
                    .size(file.getSize())
                    .mimeType(file.getContentType())
                    .build();

        } catch (Exception e) {
            log.error("S3 업로드 실패", e);
            throw new RuntimeException("이미지 업로드 실패", e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일 없음");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("10MB 초과");
        }

        String contentType = file.getContentType();
        String[] allowed = {"image/jpeg", "image/png", "image/webp"};

        if (contentType == null || Arrays.stream(allowed).noneMatch(contentType::equals)) {
            throw new IllegalArgumentException("이미지만 가능");
        }
    }
}
