package forproject.spring_oauth2_jwt.service;

//import forproject.spring_oauth2_jwt.dto.response.ResendVerificationResponse;
import forproject.spring_oauth2_jwt.entity.UserEntity;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${mail.from.email}")
    private String fromEmail;


    public void sendVerificationCodeEmail(String to,String code) throws MessagingException {
        Context context = new Context();
        context.setVariable("verificationCode", code);  // ← 토큰 대신 코드
        context.setVariable("expirationMinutes", 5);     // ← 5분

        String htmlContent = templateEngine.process("email/verification-code", context);
        System.out.println("==================== EMAIL HTML ====================");
        System.out.println(htmlContent);
        System.out.println("====================================================");
        sendEmail(to, "TravelMate 이메일 인증 코드", htmlContent);
    }

    private void sendEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);  // 발신자 이메일 설정
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    public void sendInvitationEmail(
            String to,
            String inviterName,
            String tripTitle
    ) throws MessagingException {

        Context context = new Context();
        context.setVariable("inviterName", inviterName);
        context.setVariable("tripTitle", tripTitle);
        context.setVariable("loginUrl", frontendUrl+"/login");
        context.setVariable("signupUrl", frontendUrl+"/signup");



        String htmlContent = templateEngine.process("email/invitation", context);

        System.out.println("==================== EMAIL HTML ====================");
        System.out.println(htmlContent);
        System.out.println("====================================================");
        sendEmail(to, "[TravelMate] " + tripTitle + " 여행 초대", htmlContent);
    }
}
