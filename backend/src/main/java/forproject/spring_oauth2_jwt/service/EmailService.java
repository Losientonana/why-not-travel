package forproject.spring_oauth2_jwt.service;

//import forproject.spring_oauth2_jwt.dto.response.ResendVerificationResponse;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    private static final String FROM_EMAIL = "noreply@travelmate.com";

//    public void sendVerificationEmail(String to, String userName, String token) throws MessagingException {
//        Context context = new Context();
//        context.setVariable("userName", userName);
//        context.setVariable("verificationUrl", "http://localhost:3000/verify?token=" + token);
//        context.setVariable("expirationMinutes", 60);
//
//        String htmlContent = templateEngine.process("email/verification", context);
//        sendEmail(to, "TravelMate 이메일 인증", htmlContent);
//    }

    public void sendVerificationCodeEmail(String to,String code) throws MessagingException {
        Context context = new Context();
        context.setVariable("verificationCode", code);  // ← 토큰 대신 코드
        context.setVariable("expirationMinutes", 5);     // ← 5분

        String htmlContent = templateEngine.process("email/verification-code", context);
        sendEmail(to, "TravelMate 이메일 인증 코드", htmlContent);
    }

    private void sendEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    public void sendMemberInvitationEmail(
            String to,
            String userName,
            String inviterName,
            String tripTitle,
            String token
    ) throws MessagingException {
        Context context = new Context();
        context.setVariable("userName", userName);
        context.setVariable("inviterName", inviterName);
        context.setVariable("tripTitle", tripTitle);
        context.setVariable("acceptURL","http://localhost:3000/invitations/accept?token="  + token);

        String htmlContent = templateEngine.process("email/member-invitation-email", context);
        sendEmail(to, "[TravelMate] " + tripTitle + " 여행 초대", htmlContent);
    }

    public void sendNonMemberInvitationEmail(
            String to,
            String inviterName,
            String tripTitle,
            String token
    ) throws MessagingException {

        Context context = new Context();
        context.setVariable("inviterName", inviterName);
        context.setVariable("tripTitle", tripTitle);
        context.setVariable("signupUrl", "http://localhost:3000/signup?inviteToken=" + token);

        String htmlContent = templateEngine.process("email/non-member-invitation", context);
        sendEmail(to, "[TravelMate] " + tripTitle + " 여행 초대", htmlContent);
    }

}
