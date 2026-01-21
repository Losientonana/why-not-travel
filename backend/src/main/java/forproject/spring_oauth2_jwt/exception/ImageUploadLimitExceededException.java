package forproject.spring_oauth2_jwt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ImageUploadLimitExceededException extends RuntimeException {
    public ImageUploadLimitExceededException(String message) {
        super(message);
    }
}
