package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.TravelPlanStatusResponse;
import forproject.spring_oauth2_jwt.entity.TravelPlanEntity;
import forproject.spring_oauth2_jwt.enums.TravelPlanStatus;
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
        TravelPlanEntity trip = travelPlanRepository.findByIdAndIsDeletedFalse(tripId).orElseThrow(() ->
                new IllegalArgumentException("여행을 찾을 수 없습니다."));

        if (!trip.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("여행 접근 권한이 없습니다.");
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
