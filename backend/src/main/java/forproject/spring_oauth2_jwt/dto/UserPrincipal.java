package forproject.spring_oauth2_jwt.dto;

import forproject.spring_oauth2_jwt.entity.UserEntity;
import jakarta.annotation.Nullable;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Getter
@Setter
public class UserPrincipal implements UserDetails, OAuth2User {

    private final Long id;
    private final String username;
    private final String password;
    private final String name;
    private final String email;
    private final String role;
    private final String nickname;
    private final Map<String, Object> attributes; // 소셜 로그인용(없으면 null)

    // 1) Entity로부터 생성 (일반 로그인, DB 조회)
    public UserPrincipal(UserEntity userEntity) {
        this.id = userEntity.getId();
        this.username = userEntity.getUsername();
        this.password = userEntity.getPassword();
        this.name = userEntity.getName();
        this.email = userEntity.getEmail();
        this.role = userEntity.getRole();
        this.nickname = userEntity.getNickname();
        this.attributes = null;
    }

    // 2) DTO + attributes로부터 생성 (소셜 로그인, OAuth2)
    public UserPrincipal(UserDTO userDTO, Map<String, Object> attributes) {
        this.id = userDTO.getId();
        this.username = userDTO.getUsername();
        this.password = null; // 소셜 로그인은 PW 없음
        this.name = userDTO.getName();
        this.email = userDTO.getEmail();
        this.role = userDTO.getRole();
        this.attributes = attributes != null ? Collections.unmodifiableMap(attributes) : null;
        this.nickname = userDTO.getNickname();
    }

    // ----- 공통 Getter -----
//    public Long getId() { return id; }
//    public String getName() { return name; }
//    public String getUsername() { return username; }
//    public String getEmail() { return email; }
//    public String getRole() { return role; }

    // ----- UserDetails 메서드 -----
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(() -> role); // 람다(권장), 또는 new SimpleGrantedAuthority(role)
        return authorities;
    }
    @Override
    public String getPassword() { return password; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }

    // ----- OAuth2User 메서드 -----
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }
    @Override
    public String getName() {
        return name;
    }
}
