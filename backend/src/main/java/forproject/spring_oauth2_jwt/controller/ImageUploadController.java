package forproject.spring_oauth2_jwt.controller;

import forproject.spring_oauth2_jwt.dto.ApiResponse;
import forproject.spring_oauth2_jwt.dto.ImageUploadResponse;
import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.service.ImageUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/upload")
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<ImageUploadResponse>> uploadImage(
            @RequestParam("image") MultipartFile file,
            @RequestParam(value = "purpose", defaultValue = "general") String purpose,
            @AuthenticationPrincipal UserPrincipal user) {

        try {
            log.info("이미지 업로드 요청 - 사용자: {}, 목적: {}, 파일명: {}",
                    user.getId(), purpose, file.getOriginalFilename());

            ImageUploadResponse response = imageUploadService.uploadImage(file, purpose);
            return ResponseEntity.ok(
                    ApiResponse.success(response, "이미지가 성공적으로 업로드되었습니다.")
            );

        } catch (IllegalArgumentException e) {
            log.warn("이미지 업로드 실패 - 잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("INVALID_FILE", e.getMessage())
            );

        } catch (Exception e) {
            log.error("이미지 업로드 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error("UPLOAD_FAILED", "이미지 업로드에 실패했습니다.")
            );
        }
    }
}