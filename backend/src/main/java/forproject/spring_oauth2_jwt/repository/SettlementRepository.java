package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.Settlement;
import forproject.spring_oauth2_jwt.enums.SettlementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SettlementRepository extends JpaRepository<Settlement, Long> {

    /**
     * 여행의 완료된 정산 내역 조회 (최신순)
     */
    @Query("SELECT s FROM Settlement s " +
            "WHERE s.tripId = :tripId AND s.status = :status " +
            "ORDER BY s.completedAt DESC, s.createdAt DESC")
    List<Settlement> findByTripIdAndStatus(
            @Param("tripId") Long tripId,
            @Param("status") SettlementStatus status
    );

    /**
     * 특정 사용자가 받은 정산 (toUserId = userId)
     */
    @Query("SELECT s FROM Settlement s " +
            "WHERE s.tripId = :tripId AND s.toUserId = :userId AND s.status = 'APPROVED' " +
            "ORDER BY s.completedAt DESC")
    List<Settlement> findReceivedSettlements(
            @Param("tripId") Long tripId,
            @Param("userId") Long userId
    );

    /**
     * 특정 사용자가 준 정산 (fromUserId = userId)
     */
    @Query("SELECT s FROM Settlement s " +
            "WHERE s.tripId = :tripId AND s.fromUserId = :userId AND s.status = 'APPROVED' " +
            "ORDER BY s.completedAt DESC")
    List<Settlement> findPaidSettlements(
            @Param("tripId") Long tripId,
            @Param("userId") Long userId
    );

    /**
     * 승인 대기 중인 정산 (채권자가 확인해야 하는 것들)
     */
    @Query("SELECT s FROM Settlement s " +
            "WHERE s.tripId = :tripId AND s.toUserId = :userId AND s.status = 'PENDING' " +
            "ORDER BY s.createdAt DESC")
    List<Settlement> findPendingSettlementsForCreditor(
            @Param("tripId") Long tripId,
            @Param("userId") Long userId
    );

    /**
     * 여행의 모든 정산 내역 조회 (상태 무관)
     */
    @Query("SELECT s FROM Settlement s WHERE s.tripId = :tripId ORDER BY s.createdAt DESC")
    List<Settlement> findAllByTripId(@Param("tripId") Long tripId);

    /**
     * 특정 정산 조회 (여행 ID 검증 포함)
     */
    @Query("SELECT s FROM Settlement s WHERE s.id = :id AND s.tripId = :tripId")
    Optional<Settlement> findByIdAndTripId(@Param("id") Long id, @Param("tripId") Long tripId);
}