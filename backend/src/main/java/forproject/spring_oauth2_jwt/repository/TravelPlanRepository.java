package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TravelPlanRepository extends JpaRepository<TravelPlanEntity,Long> {
    List<TravelPlanEntity> findByUser_Id(Long userId); // 유저별 일정 조회

    List<TravelPlanEntity> findByUser_IdAndIsDeletedFalse(Long userId);

    Optional<TravelPlanEntity> findByIdAndIsDeletedFalse(Long tripId);

    /**
     * 특정 파일명이 포함된 이미지를 사용하는 여행 계획 . 조회
     *
     * @param fileName 검색할 파일명(확장자 포함)
     * @return 해당 파일을 사용하는 여행 계획의 수
     */

    @Query("SELECT COUNT(t) FROM TravelPlanEntity t WHERE t.imageUrl LIKE CONCAT('%', :fileName, '%')")
    long countByImageUrlContaining(@Param("fileName") String fileName);

    /**
     * 특정 파일명이 포함된 이미지를 사용하는 여행 계획들 조회 (디버깅용)
     */
    @Query("SELECT t FROM TravelPlanEntity t WHERE t.imageUrl LIKE CONCAT('%', :fileName, '%')")
    List<TravelPlanEntity> findByImageUrlContaining(@Param("fileName") String fileName);
}
