//package forproject.spring_oauth2_jwt.dto;
//
//import forproject.spring_oauth2_jwt.entity.VerificationToken;
//import lombok.*;
//
//@Getter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class VerificationTokenDTO {
//    private Long id;
//    private Long userId;
//    private String token;
//    private String tokenType;
//    private String expiresAt;
//    private boolean expired;
//
//
//    public static VerificationTokenDTO fromEntity(VerificationToken entity) {
//        return VerificationTokenDTO.builder()
//                .id(entity.getId())
//                .userId(entity.getUser().getId())
//                .token(entity.getToken())
//                .tokenType(entity.getTokenType())
//                .expiresAt(entity.getExpiresAt().toString())
//                .expired(entity.getExpiresAt().isBefore(java.time.LocalDateTime.now()))
//                .build();
//    }
//}
