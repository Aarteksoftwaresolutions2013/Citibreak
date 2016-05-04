package fr.littlereddot.pocket.site.config;

import com.google.common.base.Optional;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Locale;
import java.util.Map;

public class TldInterceptor extends HandlerInterceptorAdapter {
    private static final Map<Locale, String> LOCALE_TLD_MAP = ImmutableMap.of(
            Locale.FRENCH, "fr",
            Locale.ENGLISH, "com"
    );

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        try {
            String remoteHost = new URL(request.getRequestURL().toString()).getHost();
            String tld = StringUtils.substringAfterLast(remoteHost, ".");
            String neededTld = Optional.fromNullable(LOCALE_TLD_MAP.get(request.getLocale())).or("com");
            if (!StringUtils.equals(tld, neededTld)) {
                response.setStatus(HttpServletResponse.SC_FOUND);
                response.setHeader("Location", "http://www.citibreak." + neededTld + "/");
                return false;
            }
        } catch (MalformedURLException e) {
            return super.preHandle(request, response, handler);
        }
        return super.preHandle(request, response, handler);
    }
}