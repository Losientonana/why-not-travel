package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelChecklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelChecklistRepository extends JpaRepository<TravelChecklist, Long> {
    /**
     * 특정 여행의 체크리스트 조회 (순서대로)
     */
    List<TravelChecklist> findByTripIdOrderByDisplayOrderAsc(Long tripId);

    /**
     * 특정 여행의 체크리스트 전체 개수
     */
    int countByTripId(Long tripId);

    /**
     * 완료된 체크리스트 개수
     */
    int countByTripIdAndCompletedTrue(Long tripId);

    /**
     * 미완료된 체크리스트 조회
     */
    List<TravelChecklist> findByTripIdAndCompletedFalseOrderByDisplayOrderAsc(Long tripId);

    /**
     * displayOrder 자동 설정을 위한 커스텀
     */
    @Query("SELECT MAX(c.displayOrder) FROM TravelChecklist c WHERE c.tripId = :tripId")
    Integer findMaxDisplayOrderByTripId(@Param("tripId") Long tripId);
}
