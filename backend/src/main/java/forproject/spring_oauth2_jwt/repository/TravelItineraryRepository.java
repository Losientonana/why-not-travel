package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelItinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelItineraryRepository extends JpaRepository<TravelItinerary, Long> {

    /**
     * 특정 여행의 일정 목록 조회 (일차 순서대로)
     */
    List<TravelItinerary> findByTripIdOrderByDayNumber(Long tripId);

    /**
     * 특정 여행의 일정 개수
     */
    int countByTripId(Long tripId);

    /**
     * 특정 여행의 특정 일자 조회
     */
    TravelItinerary findByTripIdAndDayNumber(Long tripId, Integer dayNumber);

}
