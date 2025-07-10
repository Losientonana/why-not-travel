package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.CompanionReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanionReviewRepository extends JpaRepository<CompanionReviewEntity, Long> {
}
