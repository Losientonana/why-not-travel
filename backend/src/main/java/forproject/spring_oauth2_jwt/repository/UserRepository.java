package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Boolean existsByUsername(String username);

    UserEntity findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);
}