package forproject.spring_oauth2_jwt.entity;

import forproject.spring_oauth2_jwt.enums.InvitationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "travel_invitations")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TravelInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 초대한 여행 계획 ID
     */
    @Column(nullable = false)
    private Long tripId;

    /**
     * 초대한 사람 (여행 생성자)
     */
    @Column(nullable = false)
    private Long inviterId;

    /**
     * 초대받은 이메일
     */
    @Column(nullable = false)
    private String invitedEmail;

    /**
     * 초대받은 사용자 ID(회원과 비회원의 존재 여부 확인용)
     * 비회원 초대시 null
     */
    @Column(nullable = true)
    private Long userId;

    /**
     * 초대 토큰(UUID)
     * 회원가입 링크에 포함된다. ex) /signup?inviteToken=UUID
     */
    @Column(nullable = false, unique = true)
    private String token;

    /**
     * 초대 상태
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InvitationStatus status;

    /**
     * 초대 생성 시간
     */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 만료 시간 (7일 후)
     * Service에서 명시적으로 설정
     */
    @Column(nullable = false)
    private LocalDateTime expiresAt;

    /**
     * 수락 시간 (ACCEPTED 상태일 때)
     */
    @Column(nullable = true)
    private LocalDateTime acceptedAt;
}
