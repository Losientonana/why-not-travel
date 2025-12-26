package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.annotation.RequiresTripParticipant;
import forproject.spring_oauth2_jwt.dto.request.SettlementCompleteRequest;
import forproject.spring_oauth2_jwt.dto.response.BalanceSummaryResponse;
import forproject.spring_oauth2_jwt.dto.response.SettlementListResponse;
import forproject.spring_oauth2_jwt.dto.response.SettlementPlanResponse;
import forproject.spring_oauth2_jwt.dto.response.SettlementResponse;
import forproject.spring_oauth2_jwt.entity.ExpenseParticipant;
import forproject.spring_oauth2_jwt.entity.Settlement;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.enums.NotificationType;
import forproject.spring_oauth2_jwt.enums.SettlementStatus;
import forproject.spring_oauth2_jwt.repository.ExpenseParticipantRepository;
import forproject.spring_oauth2_jwt.repository.SettlementRepository;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SettlementService {

    private final ExpenseParticipantRepository expenseParticipantRepository;
    private final SettlementRepository settlementRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /**
     * 정산 요약 조회 (개별정산 집계 + 그리디 알고리즘)
     *
     * 로직:
     * 1. ExpenseParticipant의 owedAmount 합산 (지출 장부상 순액)
     * 2. Settlement(APPROVED)에서 정산 완료된 금액 차감
     * 3. 그리디 알고리즘으로 최적 정산 플랜 생성
     */
    @RequiresTripParticipant
    public BalanceSummaryResponse getBalanceSummary(Long tripId, Long userId) {
        log.info("정산 요약 조회 - tripId: {}, userId: {}", tripId, userId);

        // === STEP 1: 현재 잔액 계산 (공식 적용) ===
        Map<Long, Long> currentBalances = calculateCurrentBalances(tripId);

        // === STEP 2: 사용자 이름 조회 (N+1 방지) ===
        Set<Long> allUserIds = currentBalances.keySet();
        Map<Long, UserEntity> userMap = getUserMap(allUserIds);

        // === STEP 3: 채권자/채무자 분리 ===
        List<BalanceSummaryResponse.PersonBalance> creditors = new ArrayList<>();
        List<BalanceSummaryResponse.PersonBalance> debtors = new ArrayList<>();

        for (Map.Entry<Long, Long> entry : currentBalances.entrySet()) {
            Long userIdEntry = entry.getKey();
            Long balance = entry.getValue();
            String userName = userMap.get(userIdEntry).getName();

            if (balance > 0) {
                creditors.add(BalanceSummaryResponse.PersonBalance.builder()
                        .userId(userIdEntry)
                        .userName(userName)
                        .amount(balance)
                        .build());
            } else if (balance < 0) {
                debtors.add(BalanceSummaryResponse.PersonBalance.builder()
                        .userId(userIdEntry)
                        .userName(userName)
                        .amount(Math.abs(balance))
                        .build());
            }
        }

        // === STEP 4: 그리디 알고리즘 실행 ===
        List<SettlementPlanResponse> optimalPlan = runGreedyAlgorithm(creditors, debtors);

        // === STEP 5: 현재 사용자의 총 받을/줄 금액 계산 ===
        Long totalToReceive = 0L;
        Long totalToPay = 0L;

        Long userBalance = currentBalances.getOrDefault(userId, 0L);
        if (userBalance > 0) {
            totalToReceive = userBalance;
        } else if (userBalance < 0) {
            totalToPay = Math.abs(userBalance);
        }

        return BalanceSummaryResponse.builder()
                .totalToReceive(totalToReceive)
                .totalToPay(totalToPay)
                .creditors(creditors)
                .debtors(debtors)
                .optimalPlan(optimalPlan)
                .build();
    }

    /**
     * 현재 잔액 계산 (공식 적용)
     *
     * 내 현재 잔액 = (지출 장부상 순액) + (정산으로 보낸 돈) - (정산으로 받은 돈)
     *
     * 중요: PENDING 정산도 포함합니다.
     * - PENDING 정산을 포함하면 새 지출이 들어와도 이미 신청한 정산 금액은 고정됩니다.
     * - REJECTED 시 자동으로 다시 계산에 포함됩니다.
     */
    private Map<Long, Long> calculateCurrentBalances(Long tripId) {
        Map<Long, Long> balances = new HashMap<>();

        // 1. 지출 장부상 순액 (ExpenseParticipant의 owedAmount 합산)
        List<ExpenseParticipant> allParticipants = expenseParticipantRepository
                .findAllByTripId(tripId);

        for (ExpenseParticipant p : allParticipants) {
            balances.merge(p.getUserId(), p.getOwedAmount(), Long::sum);
        }

        // 2. Settlement(APPROVED + PENDING) 반영
        // PENDING도 포함하여 신청된 정산은 즉시 빚에서 차감
        List<Settlement> activeSettlements = new ArrayList<>();
        activeSettlements.addAll(settlementRepository.findByTripIdAndStatus(tripId, SettlementStatus.APPROVED));
        activeSettlements.addAll(settlementRepository.findByTripIdAndStatus(tripId, SettlementStatus.PENDING));

        for (Settlement s : activeSettlements) {
            // 돈 준 사람(fromUser): 빚 갚음 → 잔액 증가(+)
            balances.merge(s.getFromUserId(), s.getAmount(), Long::sum);

            // 돈 받은 사람(toUser): 돈 받음 → 받을 권리 감소(-)
            balances.merge(s.getToUserId(), -s.getAmount(), Long::sum);
        }

        // 3. 0원인 사용자 제거
        balances.entrySet().removeIf(entry -> entry.getValue() == 0);

        return balances;
    }

    /**
     * 그리디 알고리즘 (쉬운 버전)
     *
     * 알고리즘:
     * 1. 채권자를 금액 내림차순 정렬 (가장 많이 받을 사람 우선)
     * 2. 채무자를 금액 내림차순 정렬 (가장 많이 줄 사람 우선)
     * 3. 맨 앞사람끼리 매칭 (0번 인덱스)
     * 4. 둘 중 작은 금액만큼 정산
     * 5. 정산 완료된 사람 제거, 반복
     */
    private List<SettlementPlanResponse> runGreedyAlgorithm(
            List<BalanceSummaryResponse.PersonBalance> creditors,
            List<BalanceSummaryResponse.PersonBalance> debtors
    ) {
        List<SettlementPlanResponse> results = new ArrayList<>();

        // 복사본 생성 (원본 수정 방지)
        List<Member> creditorsList = new ArrayList<>();
        List<Member> debtorsList = new ArrayList<>();

        for (BalanceSummaryResponse.PersonBalance c : creditors) {
            creditorsList.add(new Member(c.getUserId(), c.getUserName(), c.getAmount()));
        }

        for (BalanceSummaryResponse.PersonBalance d : debtors) {
            debtorsList.add(new Member(d.getUserId(), d.getUserName(), d.getAmount()));
        }

        // 금액 내림차순 정렬 (큰 금액 우선)
        Collections.sort(creditorsList, new Comparator<Member>() {
            @Override
            public int compare(Member p1, Member p2) {
                return Long.compare(p2.amount, p1.amount);
            }
        });

        Collections.sort(debtorsList, new Comparator<Member>() {
            @Override
            public int compare(Member p1, Member p2) {
                return Long.compare(p2.amount, p1.amount);
            }
        });

        // 그리디 매칭
        int i = 0; // 채권자 인덱스
        int j = 0; // 채무자 인덱스

        while (i < creditorsList.size() && j < debtorsList.size()) {
            Member creditor = creditorsList.get(i);
            Member debtor = debtorsList.get(j);

            // 둘 중 작은 금액만큼 송금
            long tradeAmount = Math.min(creditor.amount, debtor.amount);

            results.add(SettlementPlanResponse.builder()
                    .senderId(debtor.id)
                    .senderName(debtor.name)
                    .receiverId(creditor.id)
                    .receiverName(creditor.name)
                    .amount(tradeAmount)
                    .build());

            // 잔액 갱신
            creditor.amount = creditor.amount - tradeAmount;
            debtor.amount = debtor.amount - tradeAmount;

            // 0원이 된 사람은 다음 사람으로
            if (creditor.amount == 0) {
                i++;
            }
            if (debtor.amount == 0) {
                j++;
            }
        }

        return results;
    }

    /**
     * 헬퍼 클래스: 정산 계산용 간단한 DTO
     */
    private static class Member {
        Long id;
        String name;
        Long amount;

        public Member(Long id, String name, Long amount) {
            this.id = id;
            this.name = name;
            this.amount = amount;
        }
    }

    /**
     * 사용자 이름 조회 (N+1 방지)
     */
    private Map<Long, UserEntity> getUserMap(Set<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Collections.emptyMap();
        }

        return userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, user -> user));
    }

    /**
     * 정산 생성 (채무자/채권자 플로우)
     */
    @Transactional
    @RequiresTripParticipant
    public SettlementResponse createSettlement(Long tripId, Long userId, SettlementCompleteRequest request) {
        log.info("정산 생성 - tripId: {}, userId: {}, request: {}", tripId, userId, request);

        // 검증
        validateSettlementRequest(userId, request);

        // 채무자 플로우 vs 채권자 플로우 판단
        boolean isDebtorFlow = request.getFromUserId().equals(userId);
        boolean isCreditorFlow = request.getToUserId().equals(userId);

        if (!isDebtorFlow && !isCreditorFlow) {
            throw new IllegalArgumentException("본인과 관련된 정산만 생성할 수 있습니다");
        }

        // Settlement 생성
        Settlement settlement = Settlement.builder()
                .tripId(tripId)
                .fromUserId(request.getFromUserId())
                .toUserId(request.getToUserId())
                .amount(request.getAmount())
                .memo(request.getMemo())
                .requestedBy(userId)
                .build();

        if (isCreditorFlow) {
            // 채권자가 "돈 받았어요" → 즉시 승인
            settlement.setStatus(SettlementStatus.APPROVED);
            settlement.setCompletedAt(LocalDateTime.now());
        } else {
            // 채무자가 "돈 줬어요" → PENDING
            settlement.setStatus(SettlementStatus.PENDING);
        }

        settlement = settlementRepository.save(settlement);

        // 알림 전송
        sendSettlementNotification(settlement, isCreditorFlow);

        // Response 생성
        return toSettlementResponse(settlement);
    }

    /**
     * 정산 승인 (채권자만)
     */
    @Transactional
    @RequiresTripParticipant
    public SettlementResponse approveSettlement(Long tripId, Long settlementId, Long userId) {
        log.info("정산 승인 - tripId: {}, settlementId: {}, userId: {}", tripId, settlementId, userId);

        Settlement settlement = settlementRepository.findByIdAndTripId(settlementId, tripId)
                .orElseThrow(() -> new IllegalArgumentException("정산 내역을 찾을 수 없습니다"));

        // 권한 확인 (채권자만)
        if (!settlement.getToUserId().equals(userId)) {
            throw new IllegalArgumentException("채권자만 정산을 승인할 수 있습니다");
        }

        // 상태 확인
        if (settlement.getStatus() != SettlementStatus.PENDING) {
            throw new IllegalStateException("대기 중인 정산만 승인할 수 있습니다");
        }

        // 승인 처리
        settlement.setStatus(SettlementStatus.APPROVED);
        settlement.setCompletedAt(LocalDateTime.now());
        settlement = settlementRepository.save(settlement);

        // 알림 전송 (채무자에게)
        UserEntity creditor = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        String relatedData = settlement.getTripId() + ":" + settlement.getId();
        notificationService.createAndSend(
                settlement.getFromUserId(),
                NotificationType.SETTLEMENT_APPROVED,
                "정산 승인",
                creditor.getName() + "님이 " + settlement.getAmount() + "원 정산을 승인했습니다",
                relatedData
        );

        return toSettlementResponse(settlement);
    }

    /**
     * 정산 거절 (채권자만)
     */
    @Transactional
    @RequiresTripParticipant
    public SettlementResponse rejectSettlement(Long tripId, Long settlementId, Long userId, String reason) {
        log.info("정산 거절 - tripId: {}, settlementId: {}, userId: {}, reason: {}", tripId, settlementId, userId, reason);

        Settlement settlement = settlementRepository.findByIdAndTripId(settlementId, tripId)
                .orElseThrow(() -> new IllegalArgumentException("정산 내역을 찾을 수 없습니다"));

        // 권한 확인 (채권자만)
        if (!settlement.getToUserId().equals(userId)) {
            throw new IllegalArgumentException("채권자만 정산을 거절할 수 있습니다");
        }

        // 상태 확인
        if (settlement.getStatus() != SettlementStatus.PENDING) {
            throw new IllegalStateException("대기 중인 정산만 거절할 수 있습니다");
        }

        // 거절 처리
        settlement.setStatus(SettlementStatus.REJECTED);
        if (reason != null && !reason.isEmpty()) {
            settlement.setMemo(settlement.getMemo() != null
                    ? settlement.getMemo() + "\n[거절 사유] " + reason
                    : "[거절 사유] " + reason);
        }
        settlement = settlementRepository.save(settlement);

        // 알림 전송 (채무자에게)
        UserEntity creditor = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        String relatedData = settlement.getTripId() + ":" + settlement.getId();
        notificationService.createAndSend(
                settlement.getFromUserId(),
                NotificationType.SETTLEMENT_REJECTED,
                "정산 거절",
                creditor.getName() + "님이 정산 신청을 거절했습니다",
                relatedData
        );

        return toSettlementResponse(settlement);
    }

    /**
     * 정산 내역 조회 (필터링 가능)
     */
    @RequiresTripParticipant
    public SettlementListResponse getSettlements(Long tripId, Long userId, SettlementStatus status) {
        log.info("정산 내역 조회 - tripId: {}, userId: {}, status: {}", tripId, userId, status);

        List<Settlement> settlements;
        if (status != null) {
            settlements = settlementRepository.findByTripIdAndStatus(tripId, status);
        } else {
            settlements = settlementRepository.findAllByTripId(tripId);
        }

        // Settlement → SettlementResponse 변환
        List<SettlementResponse> responses = settlements.stream()
                .map(this::toSettlementResponse)
                .collect(Collectors.toList());

        return SettlementListResponse.builder()
                .settlements(responses)
                .build();
    }

    /**
     * Settlement → SettlementResponse 변환
     */
    private SettlementResponse toSettlementResponse(Settlement settlement) {
        Set<Long> userIds = new HashSet<>();
        userIds.add(settlement.getFromUserId());
        userIds.add(settlement.getToUserId());
        userIds.add(settlement.getRequestedBy());

        Map<Long, UserEntity> userMap = getUserMap(userIds);

        return SettlementResponse.fromEntity(
                settlement,
                userMap.get(settlement.getFromUserId()).getName(),
                userMap.get(settlement.getToUserId()).getName(),
                userMap.get(settlement.getRequestedBy()).getName()
        );
    }

    /**
     * 정산 요청 검증
     */
    private void validateSettlementRequest(Long userId, SettlementCompleteRequest request) {
        // 금액 검증
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new IllegalArgumentException("금액은 1원 이상이어야 합니다");
        }

        // 본인에게 정산 생성 방지
        if (request.getFromUserId().equals(request.getToUserId())) {
            throw new IllegalArgumentException("본인에게 정산을 생성할 수 없습니다");
        }

        // 사용자 존재 확인
        if (!userRepository.existsById(request.getFromUserId())) {
            throw new IllegalArgumentException("보내는 사용자를 찾을 수 없습니다");
        }
        if (!userRepository.existsById(request.getToUserId())) {
            throw new IllegalArgumentException("받는 사용자를 찾을 수 없습니다");
        }
    }

    /**
     * 정산 알림 전송
     */
    private void sendSettlementNotification(Settlement settlement, boolean isCreditorFlow) {
        Long recipientId;
        NotificationType type;
        String title;
        String message;

        if (isCreditorFlow) {
            // 채권자가 완료 → 채무자에게 알림
            recipientId = settlement.getFromUserId();
            type = NotificationType.SETTLEMENT_COMPLETED;
            title = "정산 완료";

            UserEntity creditor = userRepository.findById(settlement.getToUserId())
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
            message = creditor.getName() + "님이 " + settlement.getAmount() + "원 정산을 완료했습니다";
        } else {
            // 채무자가 신청 → 채권자에게 알림
            recipientId = settlement.getToUserId();
            type = NotificationType.SETTLEMENT_REQUEST;
            title = "정산 신청";

            UserEntity debtor = userRepository.findById(settlement.getFromUserId())
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
            message = debtor.getName() + "님이 " + settlement.getAmount() + "원 정산을 신청했습니다";
        }

        // relatedData에 "tripId:settlementId" 형식으로 저장
        String relatedData = settlement.getTripId() + ":" + settlement.getId();
        notificationService.createAndSend(recipientId, type, title, message, relatedData);
    }
}