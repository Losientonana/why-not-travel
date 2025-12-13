package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.response.InvitationAcceptResponse;
import forproject.spring_oauth2_jwt.dto.response.InvitationDetailResponse;
import forproject.spring_oauth2_jwt.dto.response.InvitationRejectResponse;
import forproject.spring_oauth2_jwt.dto.response.InvitationResponse;
import forproject.spring_oauth2_jwt.entity.TravelInvitation;
import forproject.spring_oauth2_jwt.entity.TravelParticipant;
import forproject.spring_oauth2_jwt.entity.TravelPlanEntity;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.enums.InvitationStatus;
import forproject.spring_oauth2_jwt.enums.NotificationType;
import forproject.spring_oauth2_jwt.repository.*;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TravelInvitationService {

    private final TravelPlanRepository travelPlanRepository;
    private final UserRepository userRepository;
    private final TravelInvitationRepository travelInvitationRepository;
    private final EmailService emailService;
    private final NotificationRepository notificationRepository;
    private final SseService sseService;
    private final NotificationService notificationService;
    private final TravelParticipantRepository travelParticipantRepository;

    /**
     * 여행 초대 이메일 전송
     */
//    @Transactional
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
            if (isExistingMember) {
                notificationService.createAndSend(
                        existingUser.getId(),
                        NotificationType.INVITATION,
                        "여행 초대",
                        String.format("%s님이 '%s' 여행에 초대했습니다.",
                                inviter.getName(), trip.getTitle()),
                        token  // relatedData에 토큰 저장
                );
            }

            log.info("✅ 초대 저장 완료 - email: {}, 회원 여부: {}", email, isExistingMember);

            // 이메일 발송 (회원/비회원 분기)
            log.info("title = {}",trip.getTitle());
            try {
                emailService.sendInvitationEmail(
                        email,
                        inviter.getName(),
                        trip.getTitle()
                );
                log.info("📧 초대 이메일 발송 완료: {}", email);
            } catch (Exception e) {
                log.error("❌ 이메일 발송 실패: {}, 에러: {}", email, e.getMessage());
            }
        }
    }

    /**
     * 초대 수락
     */
    @Transactional
    public InvitationAcceptResponse acceptInvitation(String token, Long userId){
        TravelInvitation invitation = travelInvitationRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 초대 토큰입니다."));

        validateInvitation(invitation, userId);

        boolean alreadyParticipant = travelParticipantRepository
                .existsByTripIdAndUserId(invitation.getTripId(), userId);

        if (alreadyParticipant) {
            throw new IllegalStateException("이미 이 여행의 참여자입니다.");
        }

        // 4. TravelParticipant 생성 (권한 부여)
        TravelParticipant participant = TravelParticipant.builder()
                .tripId(invitation.getTripId())
                .userId(userId)
                .role("MEMBER") // OWNER가 아닌 일반 멤버로 등록
                .build();

        travelParticipantRepository.save(participant);
        log.info("✅ 참여자 등록 완료 - tripId: {}, userId: {}, role: MEMBER",
                invitation.getTripId(), userId);

        // 5. 초대 상태 업데이트
        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitation.setAcceptedAt(LocalDateTime.now());

        // 6. 관련 알림 읽음 처리
        notificationService.markAsReadByRelatedData(userId, token);

        log.info("✅ 초대 수락 완료 - invitationId: {}", invitation.getId());
        return InvitationAcceptResponse.fromEntity(invitation);

    }

    /**
     * 초대 거절
     */
    @Transactional
    public InvitationRejectResponse rejectInvitation(String token, Long userId) {
        log.info("❌ 초대 거절 시작 - token: {}, userId: {}", token, userId);

        // 1. 토큰으로 초대 조회
        TravelInvitation invitation = travelInvitationRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 초대 토큰입니다."));

        // 2. 초대 검증
        validateInvitation(invitation, userId);

        // 3. 초대 상태 업데이트
        invitation.setStatus(InvitationStatus.REJECTED);

        // 4. 관련 알림 읽음 처리
        notificationService.markAsReadByRelatedData(userId, token);

        log.info("✅ 초대 거절 완료 - invitationId: {}", invitation.getId());
        return InvitationRejectResponse.fromEntity(invitation);    }

    /**
     * 초대 검증 (private)
     */
    private void validateInvitation(TravelInvitation invitation, Long userId) {
        // 1. 만료 확인
        if (LocalDateTime.now().isAfter(invitation.getExpiresAt())) {
            invitation.setStatus(InvitationStatus.EXPIRED);
            travelInvitationRepository.save(invitation);
            throw new IllegalStateException("만료된 초대입니다.");
        }

        // 2. 상태 확인
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 초대입니다. 상태: " + invitation.getStatus());
        }

        // 3. 초대받은 사용자 확인
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 회원인 경우: userId가 일치해야 함
        if (invitation.getUserId() != null && !invitation.getUserId().equals(userId)) {
            throw new IllegalArgumentException("이 초대의 대상자가 아닙니다.");
        }

        // 비회원이 회원가입한 경우: 이메일이 일치해야 함
        if (invitation.getUserId() == null && !invitation.getInvitedEmail().equals(user.getEmail())) {
            throw new IllegalArgumentException("이 초대의 대상자가 아닙니다.");
        }
    }

    /**
     * 토큰으로 초대 조회
     */
    @Transactional(readOnly = true)
    public InvitationDetailResponse getInvitationByToken(String token) {
        TravelInvitation invitation = travelInvitationRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 초대 토큰입니다."));

        TravelPlanEntity trip = travelPlanRepository.findById(invitation.getTripId())
                .orElseThrow(() -> new IllegalArgumentException("여행 정보를 찾을 수 없습니다."));

        UserEntity inviter = userRepository.findById(invitation.getInviterId())
                .orElseThrow(() -> new IllegalArgumentException("초대자 정보를 찾을 수 없습니다."));

        return InvitationDetailResponse.fromEntity(invitation, trip, inviter);}

    /**
     * 내 초대 목록 조회
     */
    @Transactional(readOnly = true)
    public List<InvitationResponse> getMyInvitations(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<TravelInvitation> invitations = travelInvitationRepository
                .findByInvitedEmailOrUserId(user.getEmail(), userId);

        // N+1 방지: 모든 tripId와 inviterId를 먼저 추출
        Set<Long> tripIds = invitations.stream()
                .map(TravelInvitation::getTripId)
                .collect(Collectors.toSet());

        Set<Long> inviterIds = invitations.stream()
                .map(TravelInvitation::getInviterId)
                .collect(Collectors.toSet());

        // 한 번에 조회
        Map<Long, String> tripTitleMap = travelPlanRepository.findAllById(tripIds).stream()
                .collect(Collectors.toMap(
                        TravelPlanEntity::getId,
                        TravelPlanEntity::getTitle
                ));

        Map<Long, String> inviterNameMap = userRepository.findAllById(inviterIds).stream()
                .collect(Collectors.toMap(
                        UserEntity::getId,
                        UserEntity::getName
                ));

        // DTO 변환
        return invitations.stream()
                .map(invitation -> {
                    String tripTitle = tripTitleMap.getOrDefault(
                            invitation.getTripId(), "알 수 없음");
                    String inviterName = inviterNameMap.getOrDefault(
                            invitation.getInviterId(), "알 수 없음");

                    return InvitationResponse.fromEntity(invitation, tripTitle, inviterName);
                })
                .collect(Collectors.toList());
    }
}
