package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.annotation.RequiresTripParticipant;
import forproject.spring_oauth2_jwt.dto.response.ExpenseStatisticsResponse;
import forproject.spring_oauth2_jwt.entity.ExpenseParticipant;
import forproject.spring_oauth2_jwt.entity.IndividualExpense;
import forproject.spring_oauth2_jwt.entity.SharedFund;
import forproject.spring_oauth2_jwt.entity.SharedFundTrade;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.enums.TradeType;
import forproject.spring_oauth2_jwt.repository.ExpenseParticipantRepository;
import forproject.spring_oauth2_jwt.repository.IndividualExpenseRepository;
import forproject.spring_oauth2_jwt.repository.SharedFundRepository;
import forproject.spring_oauth2_jwt.repository.SharedFundTradeRepository;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import forproject.spring_oauth2_jwt.repository.TravelParticipantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class StatisticsService {

    private final IndividualExpenseRepository individualExpenseRepository;
    private final ExpenseParticipantRepository expenseParticipantRepository;
    private final SharedFundRepository sharedFundRepository;
    private final SharedFundTradeRepository sharedFundTradeRepository;
    private final UserRepository userRepository;
    private final TravelParticipantRepository travelParticipantRepository;

    /**
     * 지출 통계 조회
     */
    @RequiresTripParticipant
    public ExpenseStatisticsResponse getExpenseStatistics(Long tripId, Long userId) {
        log.info("지출 통계 조회 - tripId: {}, userId: {}", tripId, userId);

        // 1. 개별 지출 조회
        List<IndividualExpense> individualExpenses = individualExpenseRepository.findByTripIdOrderByExpenseDateDesc(tripId);

        // 2. 공동경비 지출 조회
        List<SharedFundTrade> sharedExpenses = new ArrayList<>();
        Optional<SharedFund> sharedFundOpt = sharedFundRepository.findByTripId(tripId);
        if (sharedFundOpt.isPresent()) {
            Long sharedFundId = sharedFundOpt.get().getId();
            sharedExpenses = sharedFundTradeRepository
                    .findBySharedFundIdAndTradeType(sharedFundId, TradeType.EXPENSE);
        }

        // 3. 내 총 지출액 계산
        Long myTotalExpense = calculateMyTotalExpense(individualExpenses, sharedExpenses, userId);

        // 4. 1인당 평균 지출액 계산
        Long averagePerPerson = calculateAveragePerPerson(individualExpenses, sharedExpenses, tripId);

        // 5. 카테고리별 지출 (나 기준)
        List<ExpenseStatisticsResponse.CategoryBreakdown> categoryBreakdown =
                calculateCategoryBreakdown(individualExpenses, sharedExpenses, userId, myTotalExpense);

        // 6. 개인별 지출 (모든 멤버)
        List<ExpenseStatisticsResponse.PersonalBreakdown> personalBreakdown =
                calculatePersonalBreakdown(individualExpenses, sharedExpenses, tripId);

        // 7. 일별 지출 추이 (나 기준)
        List<ExpenseStatisticsResponse.DailyExpense> dailyExpenses =
                calculateDailyExpenses(individualExpenses, sharedExpenses, userId);

        return ExpenseStatisticsResponse.builder()
                .myTotalExpense(myTotalExpense)
                .averagePerPerson(averagePerPerson)
                .categoryBreakdown(categoryBreakdown)
                .personalBreakdown(personalBreakdown)
                .dailyExpenses(dailyExpenses)
                .build();
    }

    /**
     * 내 총 지출액 계산
     */
    private Long calculateMyTotalExpense(List<IndividualExpense> individualExpenses,
                                         List<SharedFundTrade> sharedExpenses, Long userId) {
        long total = 0L;

        // 개별 지출에서 내가 낸 금액
        for (IndividualExpense expense : individualExpenses) {
            for (ExpenseParticipant participant : expense.getParticipants()) {
                if (participant.getUserId().equals(userId)) {
                    total += participant.getPaidAmount();
                    break;
                }
            }
        }

        // 공동경비에서 내가 낸 금액 (균등 분담)
        // 공동경비는 모든 멤버가 균등 분담한다고 가정
        if (!sharedExpenses.isEmpty()) {
            // 여행 참가자 수 조회
            long participantCount = expenseParticipantRepository.countDistinctUserIdsByTripId(userId);
            if (participantCount > 0) {
                long sharedTotal = sharedExpenses.stream()
                        .mapToLong(SharedFundTrade::getAmount)
                        .sum();
                total += sharedTotal / participantCount;
            }
        }

        return total;
    }

    /**
     * 1인당 평균 지출액 계산
     */
    private Long calculateAveragePerPerson(List<IndividualExpense> individualExpenses,
                                           List<SharedFundTrade> sharedExpenses, Long tripId) {
        // 전체 지출 합계
        long individualTotal = individualExpenses.stream()
                .mapToLong(IndividualExpense::getTotalAmount)
                .sum();

        long sharedTotal = sharedExpenses.stream()
                .mapToLong(SharedFundTrade::getAmount)
                .sum();

        long totalExpense = individualTotal + sharedTotal;

        // 참가자 수 (여행 참가자 전체 기준)
        long participantCount = travelParticipantRepository.countByTripId(tripId);

        return participantCount > 0 ? totalExpense / participantCount : 0L;
    }

    /**
     * 카테고리별 지출 (나 기준)
     */
    private List<ExpenseStatisticsResponse.CategoryBreakdown> calculateCategoryBreakdown(
            List<IndividualExpense> individualExpenses, List<SharedFundTrade> sharedExpenses,
            Long userId, Long myTotalExpense) {

        Map<String, Long> categoryMap = new HashMap<>();

        // 개별 지출에서 내가 낸 금액을 카테고리별로 집계
        for (IndividualExpense expense : individualExpenses) {
            for (ExpenseParticipant participant : expense.getParticipants()) {
                if (participant.getUserId().equals(userId)) {
                    categoryMap.merge(expense.getCategory(), participant.getPaidAmount(), Long::sum);
                    break;
                }
            }
        }

        // 공동경비도 카테고리별로 집계 (균등 분담)
        long participantCount = expenseParticipantRepository.countDistinctUserIdsByTripId(userId);
        if (participantCount > 0) {
            for (SharedFundTrade tx : sharedExpenses) {
                String category = tx.getCategory() != null ? tx.getCategory() : "기타";
                long myShare = tx.getAmount() / participantCount;
                categoryMap.merge(category, myShare, Long::sum);
            }
        }

        // 카테고리별 색상 매핑
        Map<String, String> colorMap = getCategoryColorMap();

        // DTO 변환
        List<ExpenseStatisticsResponse.CategoryBreakdown> result = new ArrayList<>();
        for (Map.Entry<String, Long> entry : categoryMap.entrySet()) {
            double percentage = myTotalExpense > 0
                    ? (entry.getValue().doubleValue() / myTotalExpense) * 100
                    : 0.0;

            result.add(ExpenseStatisticsResponse.CategoryBreakdown.builder()
                    .category(entry.getKey())
                    .amount(entry.getValue())
                    .percentage(percentage)
                    .color(colorMap.getOrDefault(entry.getKey(), "#9ca3af"))
                    .build());
        }

        // 금액 내림차순 정렬
        result.sort((a, b) -> Long.compare(b.getAmount(), a.getAmount()));

        return result;
    }

    /**
     * 개인별 지출 (모든 멤버)
     */
    private List<ExpenseStatisticsResponse.PersonalBreakdown> calculatePersonalBreakdown(
            List<IndividualExpense> individualExpenses, List<SharedFundTrade> sharedExpenses, Long tripId) {

        Map<Long, Long> userExpenseMap = new HashMap<>();

        // 개별 지출에서 각자 낸 금액 집계
        for (IndividualExpense expense : individualExpenses) {
            for (ExpenseParticipant participant : expense.getParticipants()) {
                userExpenseMap.merge(participant.getUserId(), participant.getPaidAmount(), Long::sum);
            }
        }

        // 공동경비 균등 분담
        long participantCount = expenseParticipantRepository.countDistinctUserIdsByTripId(tripId);
        if (participantCount > 0 && !sharedExpenses.isEmpty()) {
            long sharedTotal = sharedExpenses.stream()
                    .mapToLong(SharedFundTrade::getAmount)
                    .sum();
            long sharePerPerson = sharedTotal / participantCount;

            // 모든 참가자에게 공동경비 분담액 추가
            Set<Long> allUserIds = userExpenseMap.keySet();
            for (Long userId : allUserIds) {
                userExpenseMap.merge(userId, sharePerPerson, Long::sum);
            }
        }

        // 전체 지출 합계
        long totalExpense = userExpenseMap.values().stream()
                .mapToLong(Long::longValue)
                .sum();

        // 사용자 이름 조회
        Set<Long> userIds = userExpenseMap.keySet();
        Map<Long, String> userNameMap = getUserNameMap(userIds);

        // DTO 변환
        List<ExpenseStatisticsResponse.PersonalBreakdown> result = new ArrayList<>();
        for (Map.Entry<Long, Long> entry : userExpenseMap.entrySet()) {
            double percentage = totalExpense > 0
                    ? (entry.getValue().doubleValue() / totalExpense) * 100
                    : 0.0;

            result.add(ExpenseStatisticsResponse.PersonalBreakdown.builder()
                    .userId(entry.getKey())
                    .userName(userNameMap.getOrDefault(entry.getKey(), "알 수 없음"))
                    .amount(entry.getValue())
                    .percentage(percentage)
                    .build());
        }

        // 금액 내림차순 정렬
        result.sort((a, b) -> Long.compare(b.getAmount(), a.getAmount()));

        return result;
    }

    /**
     * 일별 지출 추이 (나 기준)
     */
    private List<ExpenseStatisticsResponse.DailyExpense> calculateDailyExpenses(
            List<IndividualExpense> individualExpenses, List<SharedFundTrade> sharedExpenses, Long userId) {

        Map<String, Long> dailyMap = new HashMap<>();

        // 개별 지출에서 내가 낸 금액을 날짜별로 집계
        for (IndividualExpense expense : individualExpenses) {
            String date = expense.getExpenseDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
            for (ExpenseParticipant participant : expense.getParticipants()) {
                if (participant.getUserId().equals(userId)) {
                    dailyMap.merge(date, participant.getPaidAmount(), Long::sum);
                    break;
                }
            }
        }

        // 공동경비를 날짜별로 집계 (균등 분담)
        long participantCount = expenseParticipantRepository.countDistinctUserIdsByTripId(userId);
        if (participantCount > 0) {
            for (SharedFundTrade tx : sharedExpenses) {
                String date = tx.getCreatedAt().toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
                long myShare = tx.getAmount() / participantCount;
                dailyMap.merge(date, myShare, Long::sum);
            }
        }

        // DTO 변환
        List<ExpenseStatisticsResponse.DailyExpense> result = new ArrayList<>();
        for (Map.Entry<String, Long> entry : dailyMap.entrySet()) {
            result.add(ExpenseStatisticsResponse.DailyExpense.builder()
                    .date(entry.getKey())
                    .amount(entry.getValue())
                    .build());
        }

        // 날짜 오름차순 정렬
        result.sort(Comparator.comparing(ExpenseStatisticsResponse.DailyExpense::getDate));

        return result;
    }

    /**
     * 사용자 이름 조회 (N+1 방지)
     */
    private Map<Long, String> getUserNameMap(Set<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Collections.emptyMap();
        }

        return userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, UserEntity::getName));
    }

    /**
     * 카테고리별 색상 매핑
     */
    private Map<String, String> getCategoryColorMap() {
        Map<String, String> colorMap = new HashMap<>();
        colorMap.put("식비", "#ef4444");      // red
        colorMap.put("교통", "#3b82f6");      // blue
        colorMap.put("숙박", "#8b5cf6");      // purple
        colorMap.put("관광", "#10b981");      // green
        colorMap.put("쇼핑", "#f59e0b");      // amber
        colorMap.put("기타", "#6b7280");      // gray
        return colorMap;
    }
}
