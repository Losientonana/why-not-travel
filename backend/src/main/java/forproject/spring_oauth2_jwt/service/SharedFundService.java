package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.annotation.RequiresTripParticipant;
import forproject.spring_oauth2_jwt.dto.response.SharedFundResponse;
import forproject.spring_oauth2_jwt.dto.response.SharedFundTradeResponse;
import forproject.spring_oauth2_jwt.entity.SharedFund;
import forproject.spring_oauth2_jwt.entity.SharedFundTrade;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.repository.SharedFundRepository;
import forproject.spring_oauth2_jwt.repository.SharedFundTradeRepository;
import forproject.spring_oauth2_jwt.repository.TravelParticipantRepository;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
     * 거래 내역 조회
     */
    @RequiresTripParticipant
    public List<SharedFundTradeResponse> getTradeList(Long tripId, Long userId) {
        SharedFund sharedFund = sharedFundRepository.findByTripId(tripId).orElseGet(()-> createSharedFund(tripId));

        List<SharedFundTrade> tradeList = sharedFundTradeRepository.findBySharedFundIdOrderByCreatedAtDesc(sharedFund.getId());

        return tradeList.stream()
                .map(tx -> SharedFundTradeResponse.fromEntity(
                        tx,
                        tripId,
                        getUserName(tx.getCreatedBy())
                ))
                .collect(Collectors.toList());
    }

    /**
     * 프론트에 데이터 넘겨줄때 편하게 하기위한
     * @param userId
     * @return
     */
    private String getUserName(Long userId) {
        return userRepository.findById(userId)
                .map(UserEntity::getUsername)
                .orElse("알 수 없음");
    }

    /**
     * 공동 경비 입금
     * ✅ 프론트엔드 로직:
     * - 1인당 입금액 * 참여자 수 = 총 입금액
     */
//    @Transactional
//    public
}
