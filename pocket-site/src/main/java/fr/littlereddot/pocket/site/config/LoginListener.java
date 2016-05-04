package fr.littlereddot.pocket.site.config;

import fr.littlereddot.pocket.client.resource.HistoryResource;
import fr.littlereddot.pocket.client.resource.UserResource;
import fr.littlereddot.pocket.core.entity.User;
import org.bson.types.ObjectId;
import org.joda.time.DateTimeZone;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class LoginListener implements ApplicationListener<AuthenticationSuccessEvent> {
    @Autowired
    private UserResource userResource;
    @Autowired
    private HistoryResource historyResource;

    @Override
    public void onApplicationEvent(AuthenticationSuccessEvent event) {
        User user = (User) ((AbstractAuthenticationToken) event.getSource()).getPrincipal();
        user.setLastConnectionDate(user.getCurrentConnectionDate());
        user.setCurrentConnectionDate(new LocalDateTime(DateTimeZone.UTC).toDate());
        if (user.getLastConnectionDate() == null) {
            user.setLastConnectionDate(new LocalDateTime(DateTimeZone.UTC).toDate());
        }
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        Cookie cookie = WebUtils.getCookie(request, "citibreak.session");
        if (cookie != null) {
            historyResource.mergeHistory(user.getId(), new ObjectId(cookie.getValue()));
        }
        userResource.save(user);
    }

}