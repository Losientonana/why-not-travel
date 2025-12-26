package forproject.spring_oauth2_jwt.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 여행 참여자 권한 체크 어노테이션
 *
 * 이 어노테이션이 붙은 메서드는 실행 전에 자동으로 여행 참여자 권한을 체크합니다.
 *
 * 사용 예시:
 * <pre>
 * {@code
 * @RequiresTripParticipant
 * public SharedFundResponse getSharedFund(Long tripId, Long userId) {
 *     // 이미 참여자 체크 완료된 상태!
 * }
 * }
 * </pre>
 *
 * 파라미터 이름이 다를 경우:
 * <pre>
 * {@code
 * @RequiresTripParticipant(tripIdParam = "travelId", userIdParam = "memberId")
 * public void someMethod(Long travelId, Long memberId) {
 *     // ...
 * }
 * }
 * </pre>
 */
@Target(ElementType.METHOD)  // 메서드에만 적용 가능
@Retention(RetentionPolicy.RUNTIME)  // 런타임에 리플렉션으로 읽을 수 있음
public @interface RequiresTripParticipant {

    /**
     * tripId 파라미터의 이름 (기본값: "tripId")
     */
    String tripIdParam() default "tripId";

    /**
     * userId 파라미터의 이름 (기본값: "userId")
     */
    String userIdParam() default "userId";
}
