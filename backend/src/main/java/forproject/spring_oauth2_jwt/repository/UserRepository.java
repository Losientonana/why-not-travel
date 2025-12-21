package forproject.spring_oauth2_jwt.repository;

import forproject.spring_oauth2_jwt.entity.UserEntity;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Boolean existsByUsername(String username);

    UserEntity findByEmail(String email);

    boolean existsByEmail(String email);

//    boolean existsByNickname(String nickname);
}