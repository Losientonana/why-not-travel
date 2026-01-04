package forproject.spring_oauth2_jwt.exception;
public class DuplicateResourceException extends BaseException {

    public DuplicateResourceException(String userMessage, String debugMessage) {
        super(userMessage, debugMessage);
    }

    public DuplicateResourceException(String message) {
        super(message, message);
    }
}
