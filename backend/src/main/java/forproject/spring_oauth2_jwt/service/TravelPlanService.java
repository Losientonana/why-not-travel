package forproject.spring_oauth2_jwt.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import forproject.spring_oauth2_jwt.dto.TravelPlanCreateRequestDTO;
import forproject.spring_oauth2_jwt.dto.TravelPlanResponse;
import forproject.spring_oauth2_jwt.dto.TravelTagDto;
import forproject.spring_oauth2_jwt.entity.TravelPlanEntity;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.enums.BudgetLevel;
import forproject.spring_oauth2_jwt.enums.TravelStyle;
import forproject.spring_oauth2_jwt.repository.TravelPlanRepository;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TravelPlanService {
    private final TravelPlanRepository travelPlanRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    // 일정 생성
    public TravelPlanResponse createTravelPlan(TravelPlanCreateRequestDTO req, Long userId) {
        try {
            log.info("여행 계획 생성 시작 - 사용자: {}, 제목: {}", userId, req.getTitle());

            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

            // 태그를 JSON으로 변환
            String tagsJson = null;
            if (req.getTags() != null && !req.getTags().isEmpty()) {
                tagsJson = objectMapper.writeValueAsString(req.getTags());
            }

            // Enum 변환
            TravelStyle travelStyle = null;
            if (req.getTravelStyle() != null) {
                try {
                    travelStyle = TravelStyle.valueOf(req.getTravelStyle());
                } catch (IllegalArgumentException e) {
                    log.warn("잘못된 여행 스타일: {}", req.getTravelStyle());
                }
            }

            BudgetLevel budgetLevel = null;
            if (req.getBudgetLevel() != null) {
                try {
                    budgetLevel = BudgetLevel.valueOf(req.getBudgetLevel());
                } catch (IllegalArgumentException e) {
                    log.warn("잘못된 예산 수준: {}", req.getBudgetLevel());
                }
            }

            TravelPlanEntity entity = TravelPlanEntity.builder()
                    .title(req.getTitle())
                    .startDate(req.getStartDate())
                    .endDate(req.getEndDate())
                    .description(req.getDescription())
                    .destination(req.getDestination())
                    .imageUrl(req.getImageUri())
                    .estimatedCost(req.getEstimatedCost())
                    .tags(tagsJson)
                    .travelStyle(travelStyle)
                    .budgetLevel(budgetLevel)
                    .user(user)
                    .visibility(req.getVisibility() != null ? req.getVisibility() : "PUBLIC")
                    .build();

            TravelPlanEntity saved = travelPlanRepository.save(entity);

            // 초대 이메일 처리 (현재는 로그만 출력)
            if (req.getInviteEmails() != null && !req.getInviteEmails().isEmpty()) {
                log.info("초대할 이메일 목록: {}", req.getInviteEmails());
                // TODO: 이메일 발송 로직 구현
            }

            TravelPlanResponse resp = new TravelPlanResponse();
            resp.setId(saved.getId());
            resp.setTitle(saved.getTitle());
            resp.setStartDate(saved.getStartDate());
            resp.setEndDate(saved.getEndDate());
            resp.setDescription(saved.getDescription());
            resp.setName(user.getName());
            resp.setVisibility(saved.getVisibility());

            log.info("여행 계획 생성 완료 - ID: {}", saved.getId());
            return resp;

        } catch (JsonProcessingException e) {
            log.error("태그 JSON 변환 실패: {}", e.getMessage());
            throw new RuntimeException("여행 계획 생성 중 오류가 발생했습니다.", e);
        }
    }
//d
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
            resp.setName(plan.getUser().getName());
            resp.setVisibility(plan.getVisibility());
            resp.setDestination(plan.getDestination());
            resp.setImageUrl(plan.getImageUrl());
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

        /**
         * 이때 status의 대해서는 재활용성이 높기에 개별 서비스로 분리
         */
        TravelPlanResponse resp = new TravelPlanResponse();
        resp.setId(plan.getId());
        resp.setTitle(plan.getTitle());
        resp.setStartDate(plan.getStartDate());
        resp.setEndDate(plan.getEndDate());
        resp.setDescription(plan.getDescription());
        resp.setName(plan.getUser().getName());
        resp.setDestination(plan.getDestination());
        resp.setVisibility(plan.getVisibility());
//        resp.setCoverImage(plan.getImageUrl());

        return resp;
    }


    public TravelPlanResponse updateTravelPlan(Long tripId, TravelPlanCreateRequestDTO req, Long userId) {
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

    /**
     * DB에서 imageURL에 해당하는 이미지 갖고오는
     */
}
