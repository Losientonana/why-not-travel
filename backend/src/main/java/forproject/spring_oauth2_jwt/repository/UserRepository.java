package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Boolean existsByUsername(String username);

    UserEntity findByEmail(String email);

    UserEntity findByUsername(String username);

    boolean existsByEmail(String email);

//    boolean existsByNickname(String nickname);
}