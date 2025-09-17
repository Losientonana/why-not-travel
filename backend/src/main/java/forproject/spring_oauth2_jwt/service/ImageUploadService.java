package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.ImageUploadResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
public class ImageUploadService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.base.url:http://localhost:8080}")
    private String baseUrl;

    public ImageUploadResponse uploadImage(MultipartFile file, String purpose) {
        // 파일 유효성 검사
        validateFile(file);

        try {
            // 업로드 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir, purpose);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 고유한 파일명 생성
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName != null && originalFileName.contains(".")
                    ? originalFileName.substring(originalFileName.lastIndexOf("."))
                    : "";
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // 파일 저장
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // URL 생성
            String imageUrl = baseUrl + "/images/" + purpose + "/" + uniqueFileName;

            log.info("이미지 업로드 성공: {} -> {}", originalFileName, imageUrl);

            return ImageUploadResponse.builder()
                    .imageUrl(imageUrl)
                    .originalName(originalFileName)
                    .size(file.getSize())
                    .mimeType(file.getContentType())
                    .build();

        } catch (IOException e) {
            log.error("이미지 업로드 실패: {}", e.getMessage());
            throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }

        // 파일 크기 검사 (10MB)
        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("파일 크기가 너무 큽니다. 최대 10MB까지 가능합니다.");
        }

        // 파일 형식 검사
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드 가능합니다.");
        }

        // 허용된 이미지 형식
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
}