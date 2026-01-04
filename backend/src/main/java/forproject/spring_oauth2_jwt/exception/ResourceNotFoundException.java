package forproject.spring_oauth2_jwt.exception;

public class ResourceNotFoundException extends RuntimeException {

    private final String userMessage;      // 클라이언트용 (간결)
    private final String debugMessage;     // 로그용 (상세)

    public ResourceNotFoundException(String userMessage, String debugMessage) {
        super(debugMessage);  // 로그/스택 트레이스에 상세 메시지 포함
        this.userMessage = userMessage;
        this.debugMessage = debugMessage;
    }

    public String getUserMessage() {
        return userMessage;
    }

    public String getDebugMessage() {
        return debugMessage;
    }
}