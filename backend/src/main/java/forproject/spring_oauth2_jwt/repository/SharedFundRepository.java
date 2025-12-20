package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.SharedFund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SharedFundRepository extends JpaRepository<SharedFund, Long> {
    Optional<SharedFund> findByTripId(Long tripId);
}
