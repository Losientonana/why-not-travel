//package forproject.spring_oauth2_jwt.repository;
//
//import forproject.spring_oauth2_jwt.entity.UserEntity;
//import forproject.spring_oauth2_jwt.entity.VerificationToken;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Modifying;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//
//public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
//
//    /**
//     * 토큰값으로 토큰 객체 찾기
//     */
//    Optional<VerificationToken>findByToken(String token);
//
//    /**
//     * 토큰 재발급을 위해 사용자의 특정 토큰을 조회하기
//     */
//    Optional<VerificationToken> findByUserAndTokenType(UserEntity user, String tokenType);
//
//    /**
//     * 중복 토큰 확인 및 디버깅
//     * 여러 토큰이 발급된 경우 모두 조회용으로
//     */
//    List<VerificationToken> findAllByUserAndTokenType(
//            UserEntity user,
//            String tokenType
//    );
//
//    /**
//     * 만료된 토큰 삭제하기(배치용)
//     */
//    @Modifying
//    @Transactional
//    void deleteByExpiresAtBefore(LocalDateTime dateTime);
//
//    /**
//     * 토큰 발행을 해줄때, 기존에 있던 모든 토큰을 지우고 발행해줘야한다.
//     */
//    @Modifying
//    @Transactional
//    void deleteByUserAndTokenType(
//            UserEntity user,
//            String tokenType
//    );
//
//
//    /**
//     * 해당 사용자의 모든 토큰 삭제(탈퇴용)
//     */
//    @Modifying
//    @Transactional
//    void deleteByUser(UserEntity user);
//
//    long countByUserAndTokenTypeAndCreatedAtAfter(
//            UserEntity user,
//            String tokenType,
//            LocalDateTime since
//    );
//}
