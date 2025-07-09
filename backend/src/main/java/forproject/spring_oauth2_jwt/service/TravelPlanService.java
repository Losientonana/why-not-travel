package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.TravelPlanCreateRequest;
import forproject.spring_oauth2_jwt.dto.TravelPlanResponse;
import forproject.spring_oauth2_jwt.entity.TravelPlanEntity;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.repository.TravelPlanRepository;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
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
                .build();

        TravelPlanEntity saved = travelPlanRepository.save(entity);

        TravelPlanResponse resp = new TravelPlanResponse();
        resp.setId(saved.getId());
        resp.setTitle(saved.getTitle());
        resp.setStartDate(saved.getStartDate());
        resp.setEndDate(saved.getEndDate());
        resp.setDescription(saved.getDescription());
        resp.setNickname(user.getNickname());
        return resp;
    }

    // 내 일정 전체 조회
    public List<TravelPlanResponse> listMyPlans(Long userId) {
        List<TravelPlanEntity> plans = travelPlanRepository.findByUser_Id(userId);

        List<TravelPlanResponse> result = plans.stream().map(plan -> {
            TravelPlanResponse resp = new TravelPlanResponse();
            resp.setId(plan.getId());
            resp.setTitle(plan.getTitle());
            resp.setStartDate(plan.getStartDate());
            resp.setEndDate(plan.getEndDate());
            resp.setDescription(plan.getDescription());
            resp.setNickname(plan.getUser().getNickname());
            return resp;
        }).collect(Collectors.toList());

        return result;
    }
}
