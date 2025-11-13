package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TravelParticipantRepository extends JpaRepository<TravelParticipant, Long> {
    /**
     * 특정 여행의 참여자 목록 조회
     */
    List<TravelParticipant> findByTripIdOrderByJoinedAt(Long tripId);

    /**
     * 특정 여행의 참여자 수
     */
    int countByTripId(Long tripId);

    /**
     * 특정 사용자가 특정 여행의 참여자인지 확인
     */
    boolean existsByTripIdAndUserId(Long tripId, Long userId);

    /**
     * 특정 사용자의 역할 조회
     */
    Optional<TravelParticipant> findByTripIdAndUserId(Long tripId, Long userId);

    /**
     * 특정 여행의 방장(OWNER) 조회
     */
    Optional<TravelParticipant> findByTripIdAndRole(Long tripId, String role);

    /**
     * 사용자 정보와 함께 조회 (N+1 방지)
     */
    @Query("SELECT tp FROM TravelParticipant tp WHERE tp.tripId = :tripId ORDER BY tp.joinedAt")
    List<TravelParticipant> findByTripIdWithUser(@Param("tripId") Long tripId);
}
