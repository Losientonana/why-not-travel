package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.SharedFund;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SharedFundRepository extends JpaRepository<SharedFund, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value = "3000")})
    @Query("SELECT sf FROM SharedFund sf WHERE sf.tripId = :tripId")
    Optional<SharedFund> findByTripIdWithLock(@Param("tripId") Long tripId);

    Optional<SharedFund> findByTripId(Long tripId);
}
