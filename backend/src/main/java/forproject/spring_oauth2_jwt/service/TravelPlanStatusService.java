package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.TravelPlanStatusResponse;
import forproject.spring_oauth2_jwt.entity.TravelPlanEntity;
import forproject.spring_oauth2_jwt.enums.TravelPlanStatus;
import forproject.spring_oauth2_jwt.exception.ForbiddenException;
import forproject.spring_oauth2_jwt.exception.ResourceNotFoundException;
import forproject.spring_oauth2_jwt.repository.TravelPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class TravelPlanStatusService {
    private final TravelPlanRepository travelPlanRepository;


    /**
     * 특정 여행의 현재 상태 조회
     */

    public TravelPlanStatusResponse getTravelPlanStatus(Long tripId, Long userId) {
        TravelPlanEntity trip = travelPlanRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> {
                    log.warn("여행 상태 조회 실패 - 여행 없음: tripId={}", tripId);
                    return new ResourceNotFoundException(
                            "요청한 여행을 찾을 수 없습니다",
                            "TravelPlan not found: tripId=" + tripId
                    );
                });


        if (!trip.getUser().getId().equals(userId)) {
            log.warn("여행 상태 조회 실패 - 권한 없음: tripId={}, ownerId={}, requesterId={}",
                    tripId, trip.getUser().getId(), userId);

            throw new ForbiddenException(
                    "해당 여행에 접근할 권한이 없습니다",
                    String.format("Access denied: tripId=%d, ownerId=%d, requesterId=%d",
                            tripId, trip.getUser().getId(), userId)
            );
        }

        return TravelPlanStatusResponse.from(tripId, trip.getStartDate(), trip.getEndDate());
    }

    /**
     * 여러 여행의 상태를 한번에 조회
     */
    public List<TravelPlanStatusResponse> getTravelPlanStatuses(Long userId, List<Long> tripIds) {
        List<TravelPlanEntity> trips = travelPlanRepository.findByIdInAndUser_IdAndIsDeletedFalse(tripIds, userId);

        return trips.stream()
                .map(plan -> TravelPlanStatusResponse.from(
                        plan.getId(),
                        plan.getStartDate(),
                        plan.getEndDate()
                ))
                .collect(Collectors.toList());
    }
}
