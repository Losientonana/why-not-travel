package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.*;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CustomOAuth2UserService(UserRepository userRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println(oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("naver")) {

            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("google")) {

            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else {

            return null;
        }
        // 소셜 로그인에서 제공하는 이메일로 DB에서 사용자를 조회합니다.
        UserEntity existData = userRepository.findByEmail(oAuth2Response.getEmail());

        if (existData == null) {
            // 새로운 사용자일 경우, DB에 새로 등록합니다.
            UserEntity userEntity = new UserEntity();
            // 사용자의 고유 ID는 provider + providerId로 설정합니다.
            String username = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();
            userEntity.setUsername(username);
            userEntity.setEmail(oAuth2Response.getEmail());
            userEntity.setName(oAuth2Response.getName());
            userEntity.setVerified(true);
            userEntity.setRole("ROLE_USER");

            UserEntity savedUser = userRepository.save(userEntity);

            System.out.println("🔍 [DEBUG] 새 사용자 가입 완료 - userId: " + savedUser.getId() + ", email: " + savedUser.getEmail());

            // 🔔 가입 후 pending 초대 알림 생성
//            try {
//                System.out.println("🔍 [DEBUG] pending 초대 알림 생성 메서드 호출 시작");
//                notificationService.createNotificationsForPendingInvitations(
//                        savedUser.getId(),
//                        savedUser.getEmail()
//                );
//                System.out.println("🔍 [DEBUG] pending 초대 알림 생성 메서드 호출 완료");
//            } catch (Exception e) {
//                // 알림 생성 실패해도 로그인은 정상 진행
//                System.err.println("⚠️ 가입 후 알림 생성 실패: " + e.getMessage());
//                e.printStackTrace();
//            }
            notificationService.createNotificationsForPendingInvitations(savedUser.getId(), savedUser.getEmail());

            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(username);
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole("ROLE_USER");
            userDTO.setEmail(oAuth2Response.getEmail());

            return new UserPrincipal(userDTO, oAuth2User.getAttributes());
        } else {
            // 이미 등록된 사용자일 경우, 정보를 업데이트하고 로그인 절차를 진행합니다.
            existData.setEmail(oAuth2Response.getEmail());
            existData.setName(oAuth2Response.getName());

            userRepository.save(existData);

            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(existData.getUsername());
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole(existData.getRole());
            userDTO.setEmail(existData.getEmail());

            return new UserPrincipal(userDTO, oAuth2User.getAttributes());
        }
    }
}