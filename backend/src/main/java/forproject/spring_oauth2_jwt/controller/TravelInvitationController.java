package forproject.spring_oauth2_jwt.controller;


import forproject.spring_oauth2_jwt.dto.UserPrincipal;
import forproject.spring_oauth2_jwt.dto.response.InvitationAcceptResponse;
import forproject.spring_oauth2_jwt.dto.response.InvitationDetailResponse;
import forproject.spring_oauth2_jwt.dto.response.InvitationRejectResponse;
import forproject.spring_oauth2_jwt.dto.response.InvitationResponse;
import forproject.spring_oauth2_jwt.entity.TravelInvitation;
import forproject.spring_oauth2_jwt.service.TravelInvitationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
@Slf4j
public class TravelInvitationController {

    private final TravelInvitationService travelInvitationService;

    /**
     * 토큰으로 초대 상세 정보 조회
     * GET /api/invitations/token/{token}
     */
    @GetMapping("/token/{token}")
    public ResponseEntity<InvitationDetailResponse> getInvitationByToken(
            @PathVariable String token
    ) {
        log.info("초대 정보 조회 - token: {}", token);

        InvitationDetailResponse response =
                travelInvitationService.getInvitationByToken(token);

        return ResponseEntity.ok(response);
    }

    /**
     * 내가 받은 초대 목록 조회
     * GET /api/invitations/my
     */
    @GetMapping("/my")
    public ResponseEntity<List<InvitationResponse>> getMyInvitations(
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("내 초대 목록 조회 - userId: {}", user.getId());

        List<InvitationResponse> responses =
                travelInvitationService.getMyInvitations(user.getId());

        return ResponseEntity.ok(responses);
    }

    /**
     * 초대 수락
     * POST /api/invitations/{token}/accept
     */
    @PostMapping("/{token}/accept")
    public ResponseEntity<InvitationAcceptResponse> acceptInvitation(
            @PathVariable String token,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("초대 수락 요청 - token: {}, userId: {}", token, user.getId());

        InvitationAcceptResponse response =
                travelInvitationService.acceptInvitation(token, user.getId());

        return ResponseEntity.ok(response);
    }

    /**
     * 초대 거절
     * POST /api/invitations/{token}/reject
     */
    @PostMapping("/{token}/reject")
    public ResponseEntity<InvitationRejectResponse> rejectInvitation(
            @PathVariable String token,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        log.info("초대 거절 요청 - token: {}, userId: {}", token, user.getId());

        InvitationRejectResponse response =
                travelInvitationService.rejectInvitation(token, user.getId());

        return ResponseEntity.ok(response);
    }

}
