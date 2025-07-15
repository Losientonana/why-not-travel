package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.TravelPlanCreateRequest;
import forproject.spring_oauth2_jwt.dto.TravelPlanResponse;
import forproject.spring_oauth2_jwt.entity.TravelPlanEntity;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.repository.TravelPlanRepository;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TravelPlanService {
    private final TravelPlanRepository travelPlanRepository;
    private final UserRepository userRepository;

    // 일정 생성
    public TravelPlanResponse createTravelPlan(TravelPlanCreateRequest req, Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        TravelPlanEntity entity = TravelPlanEntity.builder()
                .title(req.getTitle())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .description(req.getDescription())
                .user(user)
                .visibility(req.getVisibility() != null ? req.getVisibility() : "PUBLIC") // 기본값
                .build();

        TravelPlanEntity saved = travelPlanRepository.save(entity);

        TravelPlanResponse resp = new TravelPlanResponse();
        resp.setId(saved.getId());
        resp.setTitle(saved.getTitle());
        resp.setStartDate(saved.getStartDate());
        resp.setEndDate(saved.getEndDate());
        resp.setDescription(saved.getDescription());
        resp.setNickname(user.getNickname());
        resp.setVisibility(saved.getVisibility());
        return resp;
    }

    // 내 일정 전체 조회
    public List<TravelPlanResponse> listMyPlans(Long userId) {
        List<TravelPlanEntity> plans = travelPlanRepository.findByUser_IdAndIsDeletedFalse(userId);

        List<TravelPlanResponse> result = plans.stream().map(plan -> {
            TravelPlanResponse resp = new TravelPlanResponse();
            resp.setId(plan.getId());
            resp.setTitle(plan.getTitle());
            resp.setStartDate(plan.getStartDate());
            resp.setEndDate(plan.getEndDate());
            resp.setDescription(plan.getDescription());
            resp.setNickname(plan.getUser().getNickname());
            resp.setVisibility(plan.getVisibility());
            return resp;
        }).collect(Collectors.toList());

        return result;
    }

    public TravelPlanResponse getTravelPlan(Long tripId, Long userId) {
        TravelPlanEntity plan = travelPlanRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> new IllegalArgumentException("해당 여행 계획을 찾을 수 없음"));

        if (!plan.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("이 여행 계획을 조회할 권한이 없습니다.");
        }

        TravelPlanResponse resp = new TravelPlanResponse();
        resp.setId(plan.getId());
        resp.setTitle(plan.getTitle());
        resp.setStartDate(plan.getStartDate());
        resp.setEndDate(plan.getEndDate());
        resp.setDescription(plan.getDescription());
        resp.setNickname(plan.getUser().getNickname());
        resp.setVisibility(plan.getVisibility());
        return resp;
    }


    public TravelPlanResponse updateTravelPlan(Long tripId, TravelPlanCreateRequest req, Long userId) {
        TravelPlanEntity travelPlanEntity = travelPlanRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> new IllegalArgumentException("해당 여행 계획을 찾을 수 없음"));

        if(!travelPlanEntity.getUser().getId().equals(userId)){
            throw new IllegalArgumentException("이 여행 계획을 수정할 권한이 없습니다.");
        }
        travelPlanEntity.setTitle(req.getTitle());
        travelPlanEntity.setStartDate(req.getStartDate());
        travelPlanEntity.setEndDate(req.getEndDate());
        travelPlanEntity.setDescription(req.getDescription());
        travelPlanEntity.setVisibility(req.getVisibility());

        TravelPlanEntity save = travelPlanRepository.save(travelPlanEntity);

        TravelPlanResponse travelPlanResponse = new TravelPlanResponse();
        travelPlanResponse.setTitle(save.getTitle());
        travelPlanResponse.setStartDate(save.getStartDate());
        travelPlanResponse.setEndDate(save.getEndDate());
        travelPlanResponse.setDescription(save.getDescription());
        travelPlanResponse.setVisibility(save.getVisibility());

        return travelPlanResponse;
    }

    @Transactional
    public void deleteTravelPlan(Long tripId, Long userId) {
        // 1. 여행 일정 조회 또는 예외 발생
        TravelPlanEntity travelPlanEntity = travelPlanRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> new IllegalArgumentException("해당 여행 계획을 찾을 수 없습니다."));

        // 2. 소유권 확인 (ID가 다를 경우 예외 발생)
        if (!travelPlanEntity.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("이 여행을 삭제할 권한이 없습니다.");
        }

        // 3. 논리적 삭제 (isDeleted 플래그를 true로 변경)
        travelPlanEntity.setDeleted(true);
        // @Transactional 어노테이션에 의해 메소드 종료 시 자동으로 DB에 반영됩니다.
    }
}
