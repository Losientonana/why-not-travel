package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TravelActivityRepository extends JpaRepository<TravelActivity, Long> {

    /**
     * 특정 일정의 활동 목록 조회 (시간 순서대로)
     */
    List<TravelActivity> findByItineraryIdOrderByDisplayOrderAscTimeAsc(Long itineraryId);

    /**
     * 여러 일정의 활동 한 번에 조회 (N+1 방지)
     */
    List<TravelActivity> findByItineraryIdInOrderByDisplayOrderAscTimeAsc(List<Long> itineraryIds);

    /**
     * 특정 일정의 활동 개수
     */

    @Query("SELECT MAX(a.displayOrder) FROM TravelActivity a WHERE a.itineraryId = :itineraryId")
    Optional<Integer> findMaxDisplayOrderByItineraryId(@Param("itineraryId") Long itineraryId);

    int countByItineraryId(Long itineraryId);
}