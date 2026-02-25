package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.ImageUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
    ImageUploadResponse uploadImage(MultipartFile file, String purpose);
    ImageUploadResponse uploadImageWithThumbnail(MultipartFile file, String purpose);
}
