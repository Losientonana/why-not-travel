package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelChecklist;
import forproject.spring_oauth2_jwt.entity.TravelPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TravelPhotoRepository extends JpaRepository<TravelChecklist, Long> {


    /**
     * 특정 여행의 사진 목록 조회 (최신순)
     */
    List<TravelPhoto> findByTripIdOrderByCreatedAtDesc(Long tripId);

    /**
     * 특정 날짜의 사진 조회
     */
    List<TravelPhoto> findByTripIdAndTakenAtOrderByCreatedAtDesc(Long tripId, LocalDate takenAt);

    /**
     * 특정 여행의 사진 개수
     */
    int countByTripId(Long tripId);

    /**
     * 특정 사용자가 업로드한 사진 조회
     */
    List<TravelPhoto> findByTripIdAndUserIdOrderByCreatedAtDesc(Long tripId, Long userId);
}
