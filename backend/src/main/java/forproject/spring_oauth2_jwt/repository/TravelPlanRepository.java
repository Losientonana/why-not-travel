package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.TravelPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TravelPlanRepository extends JpaRepository<TravelPlanEntity,Long> {
    List<TravelPlanEntity> findByUser_Id(Long userId); // 유저별 일정 조회
}
