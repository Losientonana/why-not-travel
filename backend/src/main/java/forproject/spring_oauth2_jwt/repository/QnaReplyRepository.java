package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.QnaReplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QnaReplyRepository extends JpaRepository<QnaReplyEntity, Long> {
}
