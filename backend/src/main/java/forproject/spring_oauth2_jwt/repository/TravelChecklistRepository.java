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

    long countCompletedByTripId(Long tripId);

    /**
     * displayOrder 자동 설정을 위한 커스텀
     */
    @Query("SELECT MAX(c.displayOrder) FROM TravelChecklist c WHERE c.tripId = :tripId")
    Integer findMaxDisplayOrderByTripId(@Param("tripId") Long tripId);

    // ✅ 추가: 공용 체크리스트 조회
    List<TravelChecklist> findByTripIdAndIsSharedTrueOrderByDisplayOrderAsc(Long tripId);

    // ✅ 추가: 개인 체크리스트 조회
    List<TravelChecklist> findByTripIdAndIsSharedFalseAndAssigneeUserIdOrderByDisplayOrderAsc(Long tripId, Long userId);

    // ✅ 추가: 공용 체크리스트 개수
    int countByTripIdAndIsSharedTrue(Long tripId);

    // ✅ 추가: 공용 체크리스트 완료 개수
    @Query("SELECT COUNT(c) FROM TravelChecklist c WHERE c.tripId = :tripId AND c.isShared = true AND c.completed = true")
    long countCompletedSharedByTripId(@Param("tripId") Long tripId);

    // ✅ 추가: 개인 체크리스트 개수
    int countByTripIdAndIsSharedFalseAndAssigneeUserId(Long tripId, Long userId);

    // ✅ 추가: 개인 체크리스트 완료 개수
    int countByTripIdAndIsSharedFalseAndAssigneeUserIdAndCompletedTrue(Long tripId, Long userId);

    // ✅ 추가: displayOrder 자동 설정 (공용/개인 분리)
    @Query("SELECT MAX(c.displayOrder) FROM TravelChecklist c WHERE c.tripId = :tripId AND c.isShared = :isShared")
    Integer findMaxDisplayOrderByTripIdAndIsShared(@Param("tripId") Long tripId, @Param("isShared") Boolean isShared);

    // ✅ 추가: 공용 미완료 체크리스트 조회 (최대 3개)
    List<TravelChecklist> findTop3ByTripIdAndIsSharedTrueAndCompletedFalseOrderByDisplayOrderAsc(Long tripId);

}
