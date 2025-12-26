package forproject.spring_oauth2_jwt.aspect;

import forproject.spring_oauth2_jwt.annotation.RequiresTripParticipant;
import forproject.spring_oauth2_jwt.exception.ForbiddenException;
import forproject.spring_oauth2_jwt.repository.TravelParticipantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class TripParticipantAspect {

    private final TravelParticipantRepository participantRepository;
    @Before("@annotation(requiresTripParticipant)")
    public void validateTripParticipant(
            JoinPoint joinPoint,
            RequiresTripParticipant requiresTripParticipant
    ) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] paramNames = signature.getParameterNames();
        Object[] args = joinPoint.getArgs();
        Long tripId = extractParam(
                paramNames,
                args,
                requiresTripParticipant.tripIdParam()
        );
        Long userId = extractParam(
                paramNames,
                args,
                requiresTripParticipant.userIdParam()
        );

        log.debug("여행 참여자 권한 체크 - tripId: {}, userId: {}, method: {}",
                tripId, userId, signature.getName());

        // 6. 실제 권한 체크 (DB 조회)
        participantRepository.findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new ForbiddenException("여행 참여자만 접근할 수 있습니다."));

        log.debug("권한 체크 통과 - tripId: {}, userId: {}", tripId, userId);
    }

    /**
     * 파라미터 배열에서 특정 이름의 파라미터 값 추출
     *
     * @param paramNames   파라미터 이름 배열
     * @param args         파라미터 값 배열
     * @param targetParam  찾을 파라미터 이름
     * @return 파라미터 값 (Long)
     * @throws IllegalArgumentException 파라미터를 찾을 수 없을 경우
     */
    private Long extractParam(String[] paramNames, Object[] args, String targetParam) {
        for (int i = 0; i < paramNames.length; i++) {
            if (paramNames[i].equals(targetParam)) {
                Object value = args[i];
                if (value == null) {
                    throw new IllegalArgumentException(targetParam + " 파라미터는 null일 수 없습니다.");
                }
                if (!(value instanceof Long)) {
                    throw new IllegalArgumentException(targetParam + " 파라미터는 Long 타입이어야 합니다.");
                }
                return (Long) value;
            }
        }
        throw new IllegalArgumentException("파라미터를 찾을 수 없습니다: " + targetParam);
    }
}
