package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.SharedFund;
import forproject.spring_oauth2_jwt.entity.SharedFundTrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedFundTradeRepository extends JpaRepository<SharedFundTrade,Long> {

    List<SharedFundTrade> findBySharedFundIdOrderByCreatedAtDesc(Long sharedFundId);
}
