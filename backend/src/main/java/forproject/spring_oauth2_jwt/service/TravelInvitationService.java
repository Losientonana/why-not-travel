package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.entity.TravelInvitation;
import forproject.spring_oauth2_jwt.entity.TravelPlanEntity;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.enums.InvitationStatus;
import forproject.spring_oauth2_jwt.repository.TravelInvitationRepository;
import forproject.spring_oauth2_jwt.repository.TravelPlanRepository;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class TravelInvitationService {

    private final TravelPlanRepository travelPlanRepository;
    private final UserRepository userRepository;
    private final TravelInvitationRepository travelInvitationRepository;
    private final EmailService emailService;

    /**
     * 여행 초대 이메일 전송
     */
    public void createInvitations(Long tripId, Long inviterId, List<String> inviteEmails) {
        log.info("🎫 초대 생성 시작 - tripId: {}, 초대 수: {}", tripId, inviteEmails.size());
        TravelPlanEntity trip = travelPlanRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("여행을 찾을 수 없습니다."));

        UserEntity inviter = userRepository.findById(inviterId)
                .orElseThrow(() -> new IllegalArgumentException("초대자를 찾을 수 없습니다."));

        for (String email : inviteEmails) {
            // 중복 초대 방지
            if (travelInvitationRepository.existsByTripIdAndInvitedEmailAndStatus(
                    tripId, email, InvitationStatus.PENDING)) {
                log.warn("⚠️ 이미 초대된 이메일: {}", email);
                continue;
            }

            // 회원 여부 확인
            UserEntity existingUser = userRepository.findByEmail(email);
            boolean isExistingMember = (existingUser != null);

            // 토큰 생성
            String token = UUID.randomUUID().toString();

            // 만료 시간 계산 (Service에서 명시적 설정)
            LocalDateTime expiresAt = LocalDateTime.now().plusDays(7);

            // TravelInvitation 생성
            TravelInvitation invitation = TravelInvitation.builder()
                    .tripId(tripId)
                    .inviterId(inviterId)
                    .invitedEmail(email)
                    .userId(isExistingMember ? existingUser.getId() : null)
                    .token(token)
                    .status(InvitationStatus.PENDING)
                    .expiresAt(expiresAt)  // ✅ Service에서 명시적 설정
                    .build();

            travelInvitationRepository.save(invitation);
            log.info("✅ 초대 저장 완료 - email: {}, 회원 여부: {}", email, isExistingMember);

            // 이메일 발송 (회원/비회원 분기)
            log.info("title = {}",trip.getTitle());
            try {
                if (isExistingMember) {
                    emailService.sendMemberInvitationEmail(
                            email,
                            existingUser.getName(),
                            inviter.getName(),
                            trip.getTitle(),
                            token
                    );
                    log.info("📧 기존 회원 초대 이메일 발송 완료: {}", email);
                } else {
                    emailService.sendNonMemberInvitationEmail(
                            email,
                            inviter.getName(),
                            trip.getTitle(),
                            token
                    );
                    log.info("📧 비회원 초대 이메일 발송 완료: {}", email);
                }
            } catch (Exception e) {
                log.error("❌ 이메일 발송 실패: {}, 에러: {}", email, e.getMessage());
                // 이메일 발송 실패해도 초대는 생성됨 (재발송 가능)
            }
        }
    }

    /**
     * 초대 토
     */
}
