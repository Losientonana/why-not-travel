package forproject.spring_oauth2_jwt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageUploadResponse {
    private String imageUrl;
    private String originalName;
    private long size;
    private String mimeType;
}