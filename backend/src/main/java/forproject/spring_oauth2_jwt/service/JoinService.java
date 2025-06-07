package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.JoinDTO;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

public void joinProcess(JoinDTO joinDTO) {
    String username = joinDTO.getUsername();
    String password = joinDTO.getPassword();

    if (username == null || password == null) {
        throw new IllegalArgumentException("Username and password must not be null");
    }

    Boolean isExist = userRepository.existsByUsername(username);
    if (isExist) {
        throw new IllegalStateException("User already exists");
    }

    UserEntity user = new UserEntity();
    user.setUsername(username);
    user.setPassword(bCryptPasswordEncoder.encode(password));
    user.setRole("ROLE_USER");

    userRepository.save(user);
}

}
