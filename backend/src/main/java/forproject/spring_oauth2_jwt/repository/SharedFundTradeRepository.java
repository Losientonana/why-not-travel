package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.SharedFundTrade;
import forproject.spring_oauth2_jwt.enums.TradeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SharedFundTradeRepository extends JpaRepository<SharedFundTrade,Long> {



    List<SharedFundTrade> findBySharedFundIdOrderByCreatedAtDesc(Long sharedFundId);

    /**
     * 특정 공동경비의 특정 거래 유형 조회 (통계용)
     */
    List<SharedFundTrade> findBySharedFundIdAndTradeType(Long sharedFundId, TradeType tradeType);
}
