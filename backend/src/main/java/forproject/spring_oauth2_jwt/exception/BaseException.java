package forproject.spring_oauth2_jwt.exception;

public abstract class BaseException extends RuntimeException{
    private final String userMessage;
    private final String debugMessage;

    protected BaseException(String userMessage, String debugMessage) {
        super(debugMessage);  // RuntimeException의 message는 debugMessage로 설정
        this.userMessage = userMessage;
        this.debugMessage = debugMessage;
    }

    /**
     * 클라이언트 메시지 반환
     * GlobalExceptionHandler에서 사용
     */
    public String getUserMessage() {
        return userMessage;
    }

    /**
     * 디버그 메시지 반환
     * 로깅 시 사용
     */
    public String getDebugMessage() {
        return debugMessage;
    }
}
