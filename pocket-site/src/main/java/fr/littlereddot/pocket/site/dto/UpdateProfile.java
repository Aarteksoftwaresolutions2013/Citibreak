package fr.littlereddot.pocket.site.dto;

import org.springframework.web.multipart.MultipartFile;

import com.google.common.base.Strings;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
public class UpdateProfile {
    private String name;
    private String defaultAvatar;
    private MultipartFile avatar;
    private boolean newsletterSubscription;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDefaultAvatar() {
        return defaultAvatar;
    }

    public void setDefaultAvatar(String defaultAvatar) {
        this.defaultAvatar = defaultAvatar;
    }

    public MultipartFile getAvatar() {
        return avatar;
    }

    public void setAvatar(MultipartFile avatar) {
        this.avatar = avatar;
    }

    public boolean getNewsletterSubscription() {
        return newsletterSubscription;
    }

    public void setNewsletterSubscription(String newsletterSubscription) {
        this.newsletterSubscription = Strings.isNullOrEmpty(newsletterSubscription) || Boolean.parseBoolean(newsletterSubscription);
    }
}
