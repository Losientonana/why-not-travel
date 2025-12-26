package forproject.spring_oauth2_jwt.service;

import forproject.spring_oauth2_jwt.dto.response.MyInfoResponse;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import forproject.spring_oauth2_jwt.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class MyInfoService {

    private final UserRepository userRepository;

    public MyInfoResponse myInfo(Long userId) {

        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));
        return MyInfoResponse.fromEntity(user);
    }
}
