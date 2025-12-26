package forproject.spring_oauth2_jwt.exception;

/**
 * 권한 없음 예외 (403 Forbidden)
 * 인증은 되었으나 해당 리소스에 접근할 권한이 없을 때 발생
 */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
