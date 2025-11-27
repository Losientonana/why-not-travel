package forproject.spring_oauth2_jwt.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.ByteArrayOutputStream;

@Slf4j
@Service
public class ImageProcessingService {
    private static final int THUMBNAIL_WIDTH = 400;
    private static final int THUMBNAIL_HEIGHT = 400;

    /**
     * 썸네일 생성
     *
     * 원리
     * 1. 원본 이미지 읽기
     * 비율 유지하면서 크기만 작게 리사이징
     *
     *      * @param originalFile 원본 이미지 파일
     *      * @return 썸네일 byte 배열
     *      * @throws IOException 이미지 처리 실패 시
     */
    public byte[] createThumbnail(MultipartFile originalFile) throws IOException {
        log.info("썸네일 생성 시작 - 파일명: {}, 타입: {}, 크기: {}KB",
                originalFile.getOriginalFilename(),
                originalFile.getContentType(),
                originalFile.getSize() / 1024);

        BufferedImage originalImage = null;
        try {
            originalImage = ImageIO.read(originalFile.getInputStream());
        } catch (Exception e) {
            log.error("이미지 읽기 실패: {}", e.getMessage());
            throw new IOException("이미지 파일을 읽는데 실패했습니다: " + e.getMessage());
        }

        if (originalImage == null){
            String supportedFormats = String.join(", ", ImageIO.getReaderFormatNames());
            log.error("이미지를 읽을 수 없습니다. 파일: {}, 타입: {}. 지원 형식: {}",
                    originalFile.getOriginalFilename(),
                    originalFile.getContentType(),
                    supportedFormats);
            throw new IOException(
                    "지원하지 않는 이미지 형식입니다. " +
                    "파일: " + originalFile.getOriginalFilename() +
                    ", 타입: " + originalFile.getContentType() +
                    ". JPG, PNG, GIF, BMP 형식만 지원됩니다."
            );
        }

        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();

        double ratio = Math.min(
                (double) THUMBNAIL_WIDTH / originalWidth,   // 400/3000 = 0.133
                (double) THUMBNAIL_HEIGHT / originalHeight  // 300/2000 = 0.150
        );

        int targetWidth = (int) (originalWidth * ratio);   // 400
        int targetHeight = (int) (originalHeight * ratio); // 267

        BufferedImage thumbnail = new BufferedImage(
                targetWidth,
                targetHeight,
                BufferedImage.TYPE_INT_RGB  // RGB 포맷
        );

        Graphics2D graphics = thumbnail.createGraphics();
        graphics.setRenderingHint(
                RenderingHints.KEY_INTERPOLATION,
                RenderingHints.VALUE_INTERPOLATION_BILINEAR  // 이중선형 보간
        );
        graphics.setRenderingHint(
                RenderingHints.KEY_RENDERING,
                RenderingHints.VALUE_RENDER_QUALITY  // 고품질 렌더링
        );
        graphics.setRenderingHint(
                RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON  // 안티앨리어싱 활성화
        );

        // 원본 이미지를 썸네일 크기로 그리기
        graphics.drawImage(
                originalImage,
                0, 0,              // 시작 위치
                targetWidth,       // 목표 너비
                targetHeight,      // 목표 높이
                null
        );
        graphics.dispose();

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // 5단계: JPEG 변환 및 압축
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(thumbnail, "jpg", baos);  // JPEG 압축 (품질 85% 기본)

        byte[] thumbnailBytes = baos.toByteArray();

        log.info("썸네일 생성 완료 - 크기: {}KB (원본 대비 {}%)",
                thumbnailBytes.length / 1024,
                (thumbnailBytes.length * 100 / originalFile.getSize()));

        return thumbnailBytes;  // 약 150KB
    }


}
