package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.annotation.RequiresTripParticipant;
import forproject.spring_oauth2_jwt.dto.request.SharedFundDepositRequest;
import forproject.spring_oauth2_jwt.dto.request.SharedFundExpenseRequest;
import forproject.spring_oauth2_jwt.dto.response.SharedFundResponse;
import forproject.spring_oauth2_jwt.dto.response.SharedFundTradeResponse;
import forproject.spring_oauth2_jwt.entity.SharedFund;
import forproject.spring_oauth2_jwt.entity.SharedFundTrade;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.enums.TradeType;
import forproject.spring_oauth2_jwt.repository.SharedFundRepository;
import forproject.spring_oauth2_jwt.repository.SharedFundTradeRepository;
import forproject.spring_oauth2_jwt.repository.TravelParticipantRepository;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SharedFundService {


    private final UserRepository userRepository;
    private final SharedFundRepository sharedFundRepository;
    private final TravelParticipantRepository travelParticipantRepository;
    private final SharedFundTradeRepository sharedFundTradeRepository;

    /**
     * 계좌 아직 없으면 만들기
     * @param tripId
     * @return
     */
    private SharedFund createSharedFund(Long tripId) {
        if (tripId == null) {
            throw new IllegalArgumentException("여행 ID는 필수입니다.");
        }
        SharedFund newSharedFund = SharedFund.builder()
                .tripId(tripId)
                .currentBalance(0L)
                .build();
        return sharedFundRepository.save(newSharedFund);
    }

// 얘가 지금 만약 찾아서 없으면 0으로 해야할듯?
    /**
     * 공동 경비 계좌 조회
     */
    @RequiresTripParticipant  // AOP로 자동 권한 체크!
    public SharedFundResponse getSharedFund(Long tripId, Long userId) {
        log.info("공동 경비 조회 - tripId: {}", tripId);

        // 권한 체크는 Aspect가 자동으로 처리!
        SharedFund sharedFund = sharedFundRepository.findByTripId(tripId).orElseGet(() -> createSharedFund(tripId));
        return SharedFundResponse.fromEntity(sharedFund);
    }

    /**
     * 공동경비 거래 내역 조회 (N+1 최적화)
     * TravelPlanService 패턴 적용
     */
    @RequiresTripParticipant
    public List<SharedFundTradeResponse> getTradeList(Long tripId, Long userId) {
        SharedFund sharedFund = sharedFundRepository.findByTripId(tripId)
                .orElseGet(()-> createSharedFund(tripId));

        List<SharedFundTrade> tradeList = sharedFundTradeRepository
                .findBySharedFundIdOrderByCreatedAtDesc(sharedFund.getId());

        // 1. 필요한 모든 userId 수집
        List<Long> userIds = tradeList.stream()
                .map(SharedFundTrade::getCreatedBy)
                .distinct()
                .collect(Collectors.toList());

        // 2. IN 쿼리로 모든 사용자 한 번에 조회 + Map 변환
        Map<Long, UserEntity> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));

        // 3. Stream으로 변환 (추가 쿼리 없음!)
        return tradeList.stream()
                .map(tx -> {
                    UserEntity user = userMap.get(tx.getCreatedBy());
                    String userName = (user != null) ? user.getName() : "알 수 없음";

                    return SharedFundTradeResponse.fromEntity(tx, tripId, userName);
                })
                .collect(Collectors.toList());
    }


    /**
     * 프론트에 데이터 넘겨줄때 편하게 하기위한
     * @param userId
     * @return
     */
    private String getUserName(Long userId) {
        return userRepository.findById(userId)
                .map(UserEntity::getName)  // username → name (실제 이름)
                .orElse("알 수 없음");
    }

    /**
     * 공동 경비 입금
     * ✅ 프론트엔드 로직:
     * - 1인당 입금액 * 참여자 수 = 총 입금액
     */
    @Transactional
    @RequiresTripParticipant
    public SharedFundTradeResponse deposit(Long tripId, Long userId, SharedFundDepositRequest request) {
        log.info("공동 경비 입금 - tripId: {}, amountPerPerson: {}, userId: {}",
                tripId, request.getAmountPerPerson(), userId);

        // 1. 금액 검증
        if (request.getAmountPerPerson() == null || request.getAmountPerPerson() < 0) {
            throw new IllegalArgumentException("1인당 입금액은 0원 이상이어야 합니다.");
        }

        // 2. 참여자 수 조회 (여행 주인 포함)
        int participantCount = travelParticipantRepository.countByTripId(tripId);

        // 3. 총 입금액 계산
        Long totalAmount = request.getAmountPerPerson() * participantCount;

        // 2. 공동 경비 계좌 조회 (비관적 락)
        SharedFund sharedFund = sharedFundRepository.findByTripIdWithLock(tripId).orElseGet(() -> createSharedFund(tripId));

        Long balanceAfter = sharedFund.getCurrentBalance() + totalAmount;
        sharedFund.setCurrentBalance(balanceAfter);

        String description = request.getDescription() != null && !request.getDescription().isEmpty()
                ? request.getDescription()
                : String.format("공동 경비 입금 (1인당 %,d원)", request.getAmountPerPerson());

        SharedFundTrade trade = SharedFundTrade.builder()
                .sharedFundId(sharedFund.getId())
                .tradeType(TradeType.DEPOSIT)
                .amount(totalAmount)
                .balanceAfter(balanceAfter)
                .description(description)
                .createdBy(userId)
                .build();

        sharedFundTradeRepository.save(trade);
        sharedFundRepository.save(sharedFund);

        log.info("공동 경비 입금 완료 - transactionId: {}, totalAmount: {}, balanceAfter: {}",
                trade.getId(), totalAmount, balanceAfter);

        return SharedFundTradeResponse.fromEntity(trade, tripId, getUserName(userId));
    }

    /**
     * 공동 경비 지출
     */
    @Transactional
    @RequiresTripParticipant
    public SharedFundTradeResponse expense(
            Long tripId,
            SharedFundExpenseRequest request,
            Long userId
    ) throws Exception {
        log.info("공동 경비 지출 - tripId: {}, amount: {}, category: {}, userId: {}",
                tripId, request.getAmount(), request.getCategory(), userId);

        // 1. 금액 검증
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new IllegalArgumentException("금액은 1원 이상이어야 합니다.");
        }

        // 2. 공동 경비 계좌 조회 (비관적 락)
        SharedFund sharedFund = sharedFundRepository.findByTripIdWithLock(tripId).orElseGet(() -> createSharedFund(tripId));

        // 3. 잔액 부족 체크
        if (sharedFund.getCurrentBalance() < request.getAmount()) {
            throw new Exception(
                    "잔액이 부족합니다. (현재: %,d원, 요청: %,d원)");
        }

        // 4. 잔액 업데이트
        Long balanceAfter = sharedFund.getCurrentBalance() - request.getAmount();
        sharedFund.setCurrentBalance(balanceAfter);

        // 5. 거래 내역 생성
        SharedFundTrade transaction = SharedFundTrade.builder()
                .sharedFundId(sharedFund.getId())
                .tradeType(TradeType.EXPENSE)
                .amount(request.getAmount())
                .balanceAfter(balanceAfter)
                .description(request.getDescription())
                .category(request.getCategory())
                .createdBy(userId)
                .build();

        sharedFundTradeRepository.save(transaction);
        sharedFundRepository.save(sharedFund);

        log.info("공동 경비 지출 완료 - transactionId: {}, balanceAfter: {}",
                transaction.getId(), balanceAfter);

        return SharedFundTradeResponse.fromEntity(transaction, tripId, getUserName(userId));
    }
}
