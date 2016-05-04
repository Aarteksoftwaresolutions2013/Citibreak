package fr.littlereddot.pocket.site.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.PropertiesFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import javax.mail.Session;
import java.io.IOException;
import java.util.Properties;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Configuration
public class MailConfig {
    @Value("${mail.host}")
    private String host;
    @Value("${mail.port}")
    private Integer port;
    @Value("${mail.username}")
    private String username;
    @Value("${mail.password}")
    private String password;

    @Bean
    public JavaMailSender javaMailSender() throws IOException {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
        javaMailSender.setHost(host);
        javaMailSender.setPort(port);
        if (StringUtils.isNotBlank(username)) {
            javaMailSender.setUsername(username);
        }
        if (StringUtils.isNotBlank(password)) {
            javaMailSender.setPassword(password);
        }
        PropertiesFactoryBean javaMailPropertiesFactory = new PropertiesFactoryBean();
        javaMailPropertiesFactory.setLocation(new ClassPathResource("config/mail.properties"));
        javaMailPropertiesFactory.afterPropertiesSet();
        Properties javaMailProperties = javaMailPropertiesFactory.getObject();
        javaMailSender.setJavaMailProperties(javaMailProperties);
        return javaMailSender;
    }
}
