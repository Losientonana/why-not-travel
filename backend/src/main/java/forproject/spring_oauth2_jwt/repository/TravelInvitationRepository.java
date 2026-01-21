package forproject.spring_oauth2_jwt.repository;


import forproject.spring_oauth2_jwt.entity.TravelInvitation;
import forproject.spring_oauth2_jwt.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface TravelInvitationRepository extends JpaRepository<TravelInvitation, Long> {

    boolean existsByTripIdAndInvitedEmailAndStatus(Long tripId, String email, InvitationStatus status);

    /**
     * 토큰으로 초대 조회
     * 초대 수락/거절 시 사용
     */
    Optional<TravelInvitation> findByToken(String token);

    /**
     * 이메일 또는 사용자ID로 초대 목록 조회
     * 회원가입 전/후 모두 지원
     */
    List<TravelInvitation> findByInvitedEmailOrUserId(String email, Long userId);

    /**
     * 특정 이메일로 온 PENDING 상태 초대 조회 (가입 후 알림 생성용)
     */
    List<TravelInvitation> findByInvitedEmailAndStatus(String email, InvitationStatus status);

    List<TravelInvitation> findByTripId(Long tripId);
}
