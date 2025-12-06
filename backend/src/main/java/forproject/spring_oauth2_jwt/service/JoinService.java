package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.JoinDTO;
import forproject.spring_oauth2_jwt.entity.UserEntity;
//import forproject.spring_oauth2_jwt.entity.VerificationToken;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
@RequiredArgsConstructor
@Slf4j
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final EmailVerificationCodeService emailVerificationCodeService;


    @Transactional
    public void joinProcess(JoinDTO joinDTO) {
        log.info("🔵 회원가입 시작 - 이메일: {}", joinDTO.getEmail());

        if(!emailVerificationCodeService.isEmailVerified(joinDTO.getEmail())) {
            throw new IllegalStateException("이메일 인증이 완료되지 않았습니다.");
        }
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

        // UserEntity 생성
        UserEntity user = UserEntity.builder()
                .username(joinDTO.getEmail())
                .email(joinDTO.getEmail())
                .password(bCryptPasswordEncoder.encode(joinDTO.getPassword()))
                .name(joinDTO.getName())
                .isVerified(true)  // ✅ 수정: isVarified → isVerified
                .provider(null)
                .role("ROLE_USER")
                .build();

        UserEntity savedUser = userRepository.save(user);
        log.info("✅ 사용자 저장 완료 - ID: {}, 이메일: {}", savedUser.getId(), savedUser.getEmail());

        emailVerificationCodeService.deleteVerifiedStatus(joinDTO.getEmail());
        log.info("✅ Redis 인증 상태 삭제 완료");

        // 토큰 생성
//        log.info("🔑 토큰 생성 시작...");
//        VerificationToken token = verificationTokenService
//                .createEmailVerificationToken(savedUser);
//        log.info("✅ 토큰 생성 완료 - 토큰 ID: {}, 토큰값: {}", token.getId(), token.getToken());

        // 이메일 발송
//        log.info("📧 이메일 발송 시작...");
//        emailService.sendVerificationEmail(
//                savedUser.getEmail(),
//                savedUser.getName(),  // ✅ userName 추가
//                token.getToken()
//        );
//        log.info("✅ 이메일 발송 완료");
//        log.info("🎉 회원가입 프로세스 완료");
    }
}
