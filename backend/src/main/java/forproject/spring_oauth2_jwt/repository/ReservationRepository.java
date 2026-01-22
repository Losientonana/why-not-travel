package forproject.spring_oauth2_jwt.repository;


import forproject.spring_oauth2_jwt.entity.Reservation;
import forproject.spring_oauth2_jwt.enums.ReservationStatus;
import forproject.spring_oauth2_jwt.enums.ReservationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 여행별 전체 예약 조회 (날짜순 정렬)
    List<Reservation> findByTripIdOrderByStartDateAscStartTimeAsc(Long tripId);

    // 여행별 + 타입별 예약 조회
    List<Reservation> findByTripIdAndTypeOrderByStartDateAsc(Long tripId, ReservationType type);

    // 여행별 + 상태별 예약 조회
    List<Reservation> findByTripIdAndStatusOrderByStartDateAsc(Long tripId, ReservationStatus status);

    // 여행별 예약 개수 (타입별)
    @Query("SELECT r.type, COUNT(r) FROM Reservation r WHERE r.tripId = :tripId GROUP BY r.type")
    List<Object[]> countByTripIdGroupByType(@Param("tripId") Long tripId);

    // 여행별 예약 개수 (상태별)
    @Query("SELECT r.status, COUNT(r) FROM Reservation r WHERE r.tripId = :tripId GROUP BY r.status")
    List<Object[]> countByTripIdGroupByStatus(@Param("tripId") Long tripId);

    // 여행별 전체 예약 개수
    long countByTripId(Long tripId);

    // 여행별 확정된 예약만 조회
    List<Reservation> findByTripIdAndStatus(Long tripId, ReservationStatus status);
}