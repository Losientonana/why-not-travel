package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.JoinDTO;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

//@Service
//public class JoinService {
//
//    private final UserRepository userRepository;
//    private final BCryptPasswordEncoder bCryptPasswordEncoder;
//
//    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
//        this.userRepository = userRepository;
//        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
//    }
//
//public void joinProcess(JoinDTO joinDTO) {
//    String username = joinDTO.getUsername();
//    String password = joinDTO.getPassword();
//    String email = joinDTO.getEmail();
//    String name = joinDTO.getName();
//    String nickname = joinDTO.getNickname();
//
//
//    if (username == null || password == null || email == null || name == null || nickname == null) {
//        throw new IllegalArgumentException("Username and password must not be null");
//    }
//
//    Boolean isExist = userRepository.existsByUsername(username);
//    if (isExist) {
//        throw new IllegalStateException("User already exists");
//    }
//
//    UserEntity user = new UserEntity();
//    user.setUsername(username);
//    user.setPassword(bCryptPasswordEncoder.encode(password));
//    user.setRole("ROLE_USER");
//
//    userRepository.save(user);
//}
//
//}

@Service
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void joinProcess(JoinDTO joinDTO) {
        if (userRepository.existsByEmail(joinDTO.getEmail())) {
            throw new IllegalStateException("이미 등록된 이메일입니다.");
        }

//        if (userRepository.existsByUsername(joinDTO.getUsername())) {
//            throw new IllegalStateException("이미 사용 중인 아이디입니다.");
//        }
//
//        if (userRepository.existsByNickname(joinDTO.getNickname())) {
//            throw new IllegalStateException("이미 사용 중인 닉네임입니다.");
//        }

        UserEntity user = new UserEntity();
        user.setUsername(joinDTO.getEmail()); // username을 email과 동일하게 설정
        user.setPassword(bCryptPasswordEncoder.encode(joinDTO.getPassword()));
        user.setName(joinDTO.getName());
        user.setEmail(joinDTO.getEmail());
        user.setRole("ROLE_USER");

        userRepository.save(user);
    }
}
