package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.annotation.RequiresTripParticipant;
import forproject.spring_oauth2_jwt.dto.request.PersonalExpenseCreateRequest;
import forproject.spring_oauth2_jwt.dto.request.SharedExpenseCreateRequest;
import forproject.spring_oauth2_jwt.dto.response.IndividualExpenseResponse;
import forproject.spring_oauth2_jwt.entity.ExpenseParticipant;
import forproject.spring_oauth2_jwt.repository.ExpenseParticipantRepository;
import forproject.spring_oauth2_jwt.entity.IndividualExpense;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.enums.ExpenseType;
import forproject.spring_oauth2_jwt.enums.SplitMethod;
import forproject.spring_oauth2_jwt.repository.IndividualExpenseRepository;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class IndividualExpenseService {
    private final IndividualExpenseRepository individualExpenseRepository;
    private final ExpenseParticipantRepository expenseParticipantRepository;
    private final UserRepository userRepository;

    @RequiresTripParticipant
    public IndividualExpenseResponse createPersonalExpense(
            Long tripId,
            Long userId,
            PersonalExpenseCreateRequest request
    ) {
        log.info("개인지출 등록 - tripId: {}, userId: {}, amount: {}",
                tripId, userId, request.getAmount());

        log.info("개인지출 등록 - tripId: {}, userId: {}, amount: {}",
                tripId, userId, request.getAmount());

        IndividualExpense expense = IndividualExpense.builder()
                .tripId(tripId)
                .expenseType(ExpenseType.PERSONAL)
                .totalAmount(request.getAmount())
                .foreignCurrencyAmount(request.getForeignCurrencyAmount())
                .description(request.getDescription())
                .category(request.getCategory())
                .expenseDate(request.getDate())
                .splitMethod(SplitMethod.EQUAL)
                .createdBy(userId)
                .build();

        ExpenseParticipant participant = ExpenseParticipant.builder()
                .userId(userId)
                .shareAmount(request.getAmount())
                .paidAmount(request.getAmount())
                .owedAmount(0L)
                .build();

        // 양방향 연관관계 설정
        participant.setExpense(expense);
        expense.getParticipants().add(participant);

        IndividualExpense saved = individualExpenseRepository.save(expense);

        log.info("개인지출 등록 완료 - expenseId: {}", saved.getId());

        Map<Long, UserEntity> userMap = getUserMap(Collections.singletonList(userId));
        return IndividualExpenseResponse.fromEntity(saved, userMap);
    }

    /**
     * 공유지출 등록
     */
    @RequiresTripParticipant
    public IndividualExpenseResponse createSharedExpense(
            Long tripId,
            Long userId,
            SharedExpenseCreateRequest request
    ) {
        log.info("공유지출 등록 - tripId: {}, userId: {}, amount: {}, participants: {}",
                tripId, userId, request.getAmount(), request.getParticipants().size());

        // 검증: 총액과 분담액 합계 일치 여부
        Long totalShareAmount = request.getParticipants().stream()
                .mapToLong(SharedExpenseCreateRequest.ParticipantInput::getShareAmount)
                .sum();

        if (!totalShareAmount.equals(request.getAmount())) {
            log.warn("공유지출 등록 실패 - 금액 불일치: tripId={}, totalAmount={}, shareAmountSum={}",
                    tripId, request.getAmount(), totalShareAmount);
            throw new IllegalArgumentException(
                    String.format("총액(%d원)과 분담액 합계(%d원)가 일치하지 않습니다",
                            request.getAmount(), totalShareAmount)
            );
        }

        // 2. IndividualExpense 생성
        IndividualExpense expense = IndividualExpense.builder()
                .tripId(tripId)
                .expenseType(ExpenseType.PARTIAL_SHARED)
                .totalAmount(request.getAmount())
                .foreignCurrencyAmount(request.getForeignCurrencyAmount())
                .description(request.getDescription())
                .category(request.getCategory())
                .expenseDate(request.getDate())
                .splitMethod(request.getSplitMethod())
                .createdBy(userId)
                .build();

        // 3. 참여자 추가 (for-each 사용 - 복잡한 로직)
        for (SharedExpenseCreateRequest.ParticipantInput p : request.getParticipants()) {
            Long owedAmount = p.getPaidAmount() - p.getShareAmount();

            ExpenseParticipant participant = ExpenseParticipant.builder()
                    .userId(p.getUserId())
                    .shareAmount(p.getShareAmount())
                    .paidAmount(p.getPaidAmount())
                    .owedAmount(owedAmount)
                    .build();

            participant.setExpense(expense);
            expense.getParticipants().add(participant);
        }

        IndividualExpense saved = individualExpenseRepository.save(expense);

        log.info("공유지출 등록 완료 - expenseId: {}", saved.getId());

        List<Long> userIds = request.getParticipants().stream()
                .map(SharedExpenseCreateRequest.ParticipantInput::getUserId)
                .collect(Collectors.toList());
        userIds.add(userId);

        Map<Long, UserEntity> userMap = getUserMap(userIds);
        return IndividualExpenseResponse.fromEntity(saved, userMap);
    }

    /**
     * 전체 지출 조회
     */
    @RequiresTripParticipant
    public List<IndividualExpenseResponse> getAllExpenses(Long tripId, Long userId) {
        log.info("전체 지출 조회 - tripId: {}, userId: {}", tripId, userId);

        // 1. Fetch Join으로 expense + participants 한 번에 조회
        // 개인지출은 본인 것만, 공유지출은 전체 조회
        List<IndividualExpense> expenses = individualExpenseRepository
                .findByTripIdWithParticipants(tripId)
                .stream()
                .filter(expense ->
                    expense.getExpenseType() == ExpenseType.PARTIAL_SHARED ||
                    expense.getCreatedBy().equals(userId))
                .collect(Collectors.toList());

        // 2. 필요한 모든 userId 수집
        List<Long> userIds = collectUserIds(expenses);

        // 3. IN 쿼리로 모든 사용자 한 번에 조회 + Map 변환
        Map<Long, UserEntity> userMap = getUserMap(userIds);

        // 4. Stream으로 변환 (추가 쿼리 없음!)
        return expenses.stream()
                .map(expense -> IndividualExpenseResponse.fromEntity(expense, userMap))
                .collect(Collectors.toList());
    }

    /**
     * 개인지출만 조회 (TravelPlanService 패턴)
     */
    @RequiresTripParticipant
    public List<IndividualExpenseResponse> getPersonalExpenses(Long tripId, Long userId) {
        log.info("개인지출 조회 - tripId: {}, userId: {}", tripId, userId);

        List<IndividualExpense> expenses = individualExpenseRepository
                .findByTripIdAndExpenseTypeWithParticipants(tripId, ExpenseType.PERSONAL)
                .stream()
                .filter(expense -> expense.getCreatedBy().equals(userId))
                .collect(Collectors.toList());

        List<Long> userIds = collectUserIds(expenses);
        Map<Long, UserEntity> userMap = getUserMap(userIds);

        return expenses.stream()
                .map(expense -> IndividualExpenseResponse.fromEntity(expense, userMap))
                .collect(Collectors.toList());
    }

    /**
     * 공유지출만 조회
     */
    @RequiresTripParticipant
    public List<IndividualExpenseResponse> getSharedExpenses(Long tripId, Long userId) {
        log.info("공유지출 조회 - tripId: {}, userId: {}", tripId, userId);

        List<IndividualExpense> expenses = individualExpenseRepository
                .findByTripIdAndExpenseTypeWithParticipants(tripId, ExpenseType.PARTIAL_SHARED);

        List<Long> userIds = collectUserIds(expenses);
        Map<Long, UserEntity> userMap = getUserMap(userIds);

        return expenses.stream()
                .map(expense -> IndividualExpenseResponse.fromEntity(expense, userMap))
                .collect(Collectors.toList());
    }


    /**
     * 내가 받을 돈 조회 (TravelPlanService 패턴)
     */
    @RequiresTripParticipant
    public List<IndividualExpenseResponse> getToReceive(Long tripId, Long userId) {
        log.info("내가 받을 돈 조회 - tripId: {}, userId: {}", tripId, userId);

        // Fetch Join으로 expense도 함께 조회됨
        List<ExpenseParticipant> creditors = expenseParticipantRepository
                .findCreditorsByTripIdAndUserId(tripId, userId);

        List<IndividualExpense> expenses = creditors.stream()
                .map(ExpenseParticipant::getExpense)
                .collect(Collectors.toList());

        List<Long> userIds = collectUserIds(expenses);
        Map<Long, UserEntity> userMap = getUserMap(userIds);

        return expenses.stream()
                .map(expense -> IndividualExpenseResponse.fromEntity(expense, userMap))
                .collect(Collectors.toList());
    }

    /**
     * 내가 줄 돈 조회 (TravelPlanService 패턴)
     */
    @RequiresTripParticipant
    public List<IndividualExpenseResponse> getToPay(Long tripId, Long userId) {
        log.info("내가 줄 돈 조회 - tripId: {}, userId: {}", tripId, userId);

        List<ExpenseParticipant> debtors = expenseParticipantRepository
                .findDebtorsByTripIdAndUserId(tripId, userId);

        List<IndividualExpense> expenses = debtors.stream()
                .map(ExpenseParticipant::getExpense)
                .collect(Collectors.toList());

        List<Long> userIds = collectUserIds(expenses);
        Map<Long, UserEntity> userMap = getUserMap(userIds);

        return expenses.stream()
                .map(expense -> IndividualExpenseResponse.fromEntity(expense, userMap))
                .collect(Collectors.toList());
    }



    /**
     * 모든 userId 수집 (creator + participants)
     * TravelPlanService 패턴과 동일
     */
    private List<Long> collectUserIds(List<IndividualExpense> expenses) {
        List<Long> userIds = new ArrayList<>();

        for (IndividualExpense expense : expenses) {
            userIds.add(expense.getCreatedBy());
            expense.getParticipants().forEach(p -> userIds.add(p.getUserId()));
        }

        return userIds.stream().distinct().collect(Collectors.toList());
    }

    /**
     * 사용자 이름 조회 (단일)
     * @param userId
     * @return
     */
    private String getUserName(Long userId) {
        return userRepository.findById(userId)
                .map(UserEntity::getName)
                .orElse("알 수 없음");
    }

    /**
     * IN 쿼리로 모든 사용자 한 번에 조회 + Map 변환
     * TravelPlanService 패턴과 동일
     */
    private Map<Long, UserEntity> getUserMap(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Collections.emptyMap();
        }

        return userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));
    }
}
