package fr.littlereddot.pocket.site.service;

import com.google.common.collect.Sets;
import fr.littlereddot.pocket.core.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring4.SpringTemplateEngine;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Locale;
import java.util.Set;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Service
public class MailService {
    private static final Logger logger = LoggerFactory.getLogger(MailService.class);
    private static final Set<String> availableLanguages = Sets.newHashSet("en", "fr");

    @Autowired
    private ApplicationContext context;
    @Autowired
    private JavaMailSender mailSender;
    private TemplateEngine templateEngine;

    public MailService() {
        this.templateEngine = new SpringTemplateEngine();
        ClassLoaderTemplateResolver emailTemplateResolver = new ClassLoaderTemplateResolver();
        emailTemplateResolver.setPrefix("email/");
        emailTemplateResolver.setTemplateMode("HTML5");
        emailTemplateResolver.setCharacterEncoding("UTF-8");
        this.templateEngine.addTemplateResolver(emailTemplateResolver);
    }

    public void sendMail(final User user, final Locale locale, final String mail) {
        try {
            final Context ctx = new Context(locale);
            ctx.setVariable("user", user);
            ctx.setVariable("language", locale.getLanguage());
            final MimeMessage mimeMessage = this.mailSender.createMimeMessage();
            final MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
            mimeMessageHelper.setTo(user.getEmail());
            mimeMessageHelper.setFrom("root@citibreak.fr", "Citibreak");
            final String subject = context.getMessage("email.subject." + mail, null, "Citibreak", locale);
            mimeMessageHelper.setSubject(subject);
            String language = locale.getLanguage();
            if (!availableLanguages.contains(language)) {
                language = "en";
            }
            mimeMessageHelper.setText(this.templateEngine.process(language + "/" + mail + ".html", ctx));
            this.mailSender.send(mimeMessage);
        } catch (Exception e) {
            logger.error("Impossible to send mail to {} : {}", user.getEmail(), e.getMessage());
        }
    }
}
