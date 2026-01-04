package forproject.spring_oauth2_jwt.exception;



import forproject.spring_oauth2_jwt.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

/**
 * 전역 예외 처리기
 *
 * <p><b>핵심 설계 원칙</b></p>
 * <pre>
 * 1. 클라이언트 응답: 간결하고 안전한 메시지만
 *    - 내부 구조 정보 노출 금지
 *    - 일반화된 메시지 사용
 *    - HTTP 상태 코드로 에러 종류 구분
 *
 * 2. 서버 로그: 상세한 디버깅 정보
 *    - 예외 발생 원인 (파라미터, ID 등)
 *    - 요청 경로 및 HTTP 메서드
 *    - 스택 트레이스 (ERROR 레벨 예외만)
 *
 * 3. 로그 레벨 구분
 *    - WARN: 예상 가능한 예외 (404, 409, 403 등)
 *    - ERROR: 예상치 못한 예외 (500)
 * </pre>
 *
 * <p><b>코드 흐름</b></p>
 * <pre>
 * Service에서 예외 발생
 *   → GlobalExceptionHandler가 catch
 *   → 로그 기록 (debugMessage 사용)
 *   → 클라이언트 응답 (userMessage 사용)
 * </pre>
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ═══════════════════════════════════════════════════════════════
    // 1. Custom Exception 처리 (우리가 직접 만든 예외들)
    // ═══════════════════════════════════════════════════════════════

    /**
     * 리소스 없음 (404)
     *
     * <p><b>처리 방식</b></p>
     * <pre>
     * 로그: WARN 레벨 (예상 가능한 상황)
     *   - 사용자가 잘못된 ID를 입력했을 수 있음
     *   - 디버깅 정보: tripId, userId 등
     *
     * 응답: 간결한 메시지
     *   - userMessage 사용
     *   - 내부 정보 노출 금지
     * </pre>
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFoundException(
            ResourceNotFoundException e,
            HttpServletRequest request) {

        // ✅ 서버 로그: 상세 정보 (debugMessage)
        log.warn("❌ [404] 리소스 없음: path={}, message={}",
                request.getRequestURI(),
                e.getDebugMessage());  // debugMessage: "Trip not found: tripId=123"

        // ✅ 클라이언트 응답: 간결한 메시지 (userMessage)
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(
                        "NOT_FOUND",
                        e.getUserMessage()  // userMessage: "요청한 여행을 찾을 수 없습니다"
                ));
    }


    /**
     * 중복 리소스 (409)
     *
     * <p><b>처리 방식</b></p>
     * <pre>
     * 로그: WARN 레벨
     *   - 중복 시도는 예상 가능한 상황
     *   - 어떤 필드가 중복인지 로그에 기록
     *
     * 응답: 사용자 친화적 메시지
     *   - "이미 존재합니다" 수준
     *   - 어떤 값이 중복인지는 노출하지 않음
     * </pre>
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<?>> handleDuplicateResourceException(
            DuplicateResourceException e,
            HttpServletRequest request) {

        log.warn("❌ [409] 중복 리소스: path={}, message={}",
                request.getRequestURI(),
                e.getDebugMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(
                        "DUPLICATE",
                        e.getUserMessage()
                ));
    }


    /**
     * 인증 실패 (401)
     *
     * <p><b>보안 주의사항</b></p>
     * <pre>
     * 로그: WARN 레벨
     *   - 토큰 만료 시간, 사용자 ID 등 기록
     *   - 무차별 대입 공격(Brute Force) 탐지 가능
     *
     * 응답: 최소한의 정보만
     *   - "인증에 실패했습니다"만 전달
     *   - 실패 이유 노출 금지 (타이밍 공격 방지)
     * </pre>
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<?>> handleUnauthorizedException(
            UnauthorizedException e,
            HttpServletRequest request) {

        log.warn("❌ [401] 인증 실패: path={}, message={}",
                request.getRequestURI(),
                e.getDebugMessage());

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(
                        "UNAUTHORIZED",
                        e.getUserMessage()
                ));
    }


    /**
     * 권한 없음 (403)
     *
     * <p><b>보안 주의사항</b></p>
     * <pre>
     * 로그: WARN 레벨
     *   - 누가(requesterId) 누구의(ownerId) 리소스에 접근 시도했는지 기록
     *   - 보안 감사(Security Audit)에 활용
     *
     * 응답: 일반화된 메시지
     *   - "접근 권한이 없습니다"만 전달
     *   - 리소스 소유자 정보 노출 금지
     * </pre>
     */
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiResponse<?>> handleForbiddenException(
            ForbiddenException e,
            HttpServletRequest request) {

        log.warn("❌ [403] 권한 없음: path={}, message={}",
                request.getRequestURI(),
                e.getDebugMessage());

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(
                        "FORBIDDEN",
                        e.getUserMessage()
                ));
    }


    // ═══════════════════════════════════════════════════════════════
    // 2. Spring Framework 예외 처리
    // ═══════════════════════════════════════════════════════════════

    /**
     * 유효성 검증 실패 (400)
     *
     * <p><b>처리 방식</b></p>
     * <pre>
     * @Valid 어노테이션으로 검증 실패 시 발생
     *
     * 로그: WARN 레벨
     *   - 어떤 필드가 잘못되었는지 기록
     *   - 클라이언트 입력 오류 패턴 분석 가능
     *
     * 응답: 필드별 에러 메시지
     *   - "title: 제목은 필수입니다" 같은 구체적 메시지
     *   - 사용자가 수정할 수 있도록 안내
     * </pre>
     *
     * <p><b>예시</b></p>
     * <pre>{@code
     * // Request DTO
     * public class TripRequest {
     *     @NotBlank(message = "제목은 필수입니다")
     *     private String title;
     *
     *     @Future(message = "시작일은 미래 날짜여야 합니다")
     *     private LocalDate startDate;
     * }
     *
     * // 클라이언트가 빈 title로 요청
     * {
     *   "title": "",
     *   "startDate": "2024-01-01"
     * }
     *
     * // 응답
     * {
     *   "error": "VALIDATION_ERROR",
     *   "message": "title: 제목은 필수입니다, startDate: 시작일은 미래 날짜여야 합니다"
     * }
     * }</pre>
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationException(
            MethodArgumentNotValidException e,
            HttpServletRequest request) {

        // 필드별 에러 메시지 수집
        String errorMessage = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        // 로그: 어떤 필드가 잘못되었는지
        log.warn("❌ [400] 유효성 검증 실패: path={}, errors={}",
                request.getRequestURI(),
                errorMessage);

        // 응답: 필드별 에러 메시지 (이건 노출해도 OK)
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error("VALIDATION_ERROR", errorMessage));
    }


    /**
     * 데이터 무결성 위반 (409)
     *
     * <p><b>처리 방식</b></p>
     * <pre>
     * DB 제약조건 위반 시 발생 (Unique, Foreign Key 등)
     *
     * 문제: 원본 에러 메시지가 매우 상세함
     *   "could not execute statement; SQL [n/a]; constraint [uk_user_email];
     *    nested exception is org.hibernate.exception.ConstraintViolationException..."
     *
     * 해결: 일반화된 메시지로 변환
     *   클라이언트: "이미 존재하는 데이터입니다"
     *   로그: 원본 에러 메시지 전체 기록
     * </pre>
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<?>> handleDataIntegrityViolationException(
            DataIntegrityViolationException e,
            HttpServletRequest request) {

        // ✅ 서버 로그: 상세한 JDBC 에러 메시지 (디버깅용)
        log.warn("❌ [409] 데이터 무결성 위반: path={}, error={}",
                request.getRequestURI(),
                e.getMostSpecificCause().getMessage());  // JDBC 에러 메시지

        // ✅ 클라이언트: 일반화된 메시지 (내부 정보 숨김)
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(
                        "DUPLICATE",
                        "이미 존재하는 데이터입니다"  // 제약조건명 노출 안 함!
                ));
    }


    // ═══════════════════════════════════════════════════════════════
    // 3. 예상치 못한 예외 (Catch-All)
    // ═══════════════════════════════════════════════════════════════

    /**
     * 예상치 못한 모든 예외 (500)
     *
     * <p><b>처리 방식</b></p>
     * <pre>
     * 위의 핸들러들이 처리하지 못한 모든 예외
     *
     * 로그: ERROR 레벨 (심각한 오류)
     *   - 전체 스택 트레이스 기록
     *   - 즉시 확인 및 수정 필요
     *   - 모니터링 알람 연동 권장
     *
     * 응답: 최소한의 정보
     *   - "서버 오류가 발생했습니다"만 전달
     *   - 절대 스택 트레이스 노출 금지!
     * </pre>
     *
     * <p><b>보안 위험 사례</b></p>
     * <pre>
     * ❌ 절대 이렇게 하면 안 됨:
     * {
     *   "error": "INTERNAL_ERROR",
     *   "message": "NullPointerException at TripService.java:123",
     *   "stackTrace": ["at com.example...", "at org.springframework..."]
     * }
     *
     * 위험:
     *   - 클래스명, 파일명, 줄번호 노출
     *   - 사용 중인 프레임워크 버전 추측 가능
     *   - 공격자가 취약점 찾기 쉬움
     * </pre>
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGeneralException(
            Exception e,
            HttpServletRequest request) {

        // ✅ 서버 로그: 상세한 에러 정보 + 스택 트레이스
        log.error("❌ [500] 예상치 못한 오류: path={}, method={}, error={}",
                request.getRequestURI(),
                request.getMethod(),
                e.getMessage(),
                e);  // Exception 객체를 마지막 파라미터로 → 스택 트레이스 자동 출력

        // ✅ 클라이언트: 일반화된 메시지 (내부 정보 완전 숨김)
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(
                        "INTERNAL_ERROR",
                        "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."  // 스택 트레이스 노출 절대 금지!
                ));
    }
}