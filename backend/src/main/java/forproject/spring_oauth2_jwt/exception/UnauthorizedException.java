package forproject.spring_oauth2_jwt.exception;

public class UnauthorizedException extends BaseException {

    public UnauthorizedException(String userMessage, String debugMessage) {
        super(userMessage, debugMessage);
    }

    public UnauthorizedException(String message) {
        super(message, message);
    }
}