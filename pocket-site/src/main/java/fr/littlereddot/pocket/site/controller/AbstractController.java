package fr.littlereddot.pocket.site.controller;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */

import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.site.entity.CountryParam;
import fr.littlereddot.pocket.site.entity.NavigationParam;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.TimeUnit;

public abstract class AbstractController {
    @Value("${spring.social.facebook.appId}")
    private String facebookAppId;
    @Autowired
    protected CountryParam countryParam;
    @Autowired
    protected NavigationParam navigationParam;

    @ModelAttribute("countryParam")
    public CountryParam getCountryParam() {
        return countryParam;
    }

    @ModelAttribute("navigationParam")
    public NavigationParam getNavigationParam() {
        return navigationParam;
    }

    @ModelAttribute("user")
    public User getUser(final Authentication principal) {
        if (principal == null || !principal.isAuthenticated()) {
            return null;
        }
        return (User) principal.getPrincipal();
    }

    protected String getPreviousPage(HttpServletRequest request) {
        String origin = request.getHeader("Referer");
        if (StringUtils.isNotBlank(origin)) {
            return origin;
        }
        return request.getHeader("Origin");
    }

    @ModelAttribute("facebookAppId")
    public String getFacebookAppId() {
        return facebookAppId;
    }

    @ModelAttribute("sessionId")
    public String getSessionId(final HttpServletRequest request) {
        Cookie sessionCookie = getSessionCookie(request);
        if (sessionCookie == null) {
            sessionCookie = constructSessionCookie(request);
        }
        return sessionCookie.getValue();
    }

    protected Cookie getSessionCookie(HttpServletRequest request) {
        return WebUtils.getCookie(request, "citibreak.session");
    }

    protected Cookie constructSessionCookie(HttpServletRequest request) {
        Cookie cookie = new Cookie("citibreak.session", new ObjectId(request.getSession().getId().substring(0, 24)).toString());
        cookie.setMaxAge((int) TimeUnit.DAYS.toSeconds(7));
        cookie.setPath("/");
        return cookie;
    }

    protected ObjectId getSessionId(HttpServletRequest request, HttpServletResponse response) {
        Cookie sessionCookie = getSessionCookie(request);
        if (sessionCookie == null) {
            sessionCookie = constructSessionCookie(request);
            response.addCookie(sessionCookie);
        }
        return new ObjectId(sessionCookie.getValue());
    }

    protected ObjectId getAnyUserId(HttpServletRequest request, Authentication principal, String sessionId) {
        ObjectId userId;
        if (principal != null && principal.isAuthenticated()) {
            userId = ((User) principal.getPrincipal()).getId();
        } else {
            Cookie sessionCookie = getSessionCookie(request);
            if (sessionId != null) {
                userId = new ObjectId(sessionId);
            } else {
                userId = new ObjectId(sessionCookie.getValue());
            }
        }
        return userId;
    }

}
