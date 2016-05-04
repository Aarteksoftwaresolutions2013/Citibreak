package fr.littlereddot.pocket.site.config;

import com.google.common.base.Optional;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang.StringUtils;
import org.springframework.context.i18n.LocaleContext;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AbstractLocaleContextResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Locale;
import java.util.Map;

/**
 * {@link LocaleResolver} implementation that simply uses the primary locale
 * specified in the "tld" of the HTTP request.
 * <p/>
 * <p>Note: Does not support {@code setLocale}, since the tld cannot be changed.
 *
 * @see javax.servlet.http.HttpServletRequest#getLocale()
 */
public class TldLocaleResolver extends AbstractLocaleContextResolver {

    private static final Map<String, Locale> TLD_LOCALE_MAP = ImmutableMap.of(
            "fr", Locale.FRANCE,
            "com", Locale.UK
    );


    @Override
    public Locale resolveLocale(HttpServletRequest request) {

        try {
            String remoteHost = new URL(request.getRequestURL().toString()).getHost();
            String tld = StringUtils.substringAfterLast(remoteHost, ".");
            return Optional.fromNullable(TLD_LOCALE_MAP.get(tld)).or(Locale.UK);
        } catch (MalformedURLException e) {
            return Locale.UK;
        }
    }

    @Override
    public LocaleContext resolveLocaleContext(final HttpServletRequest request) {
        return new LocaleContext() {
            @Override
            public Locale getLocale() {
                return resolveLocale(request);
            }
        };
    }

    @Override
    public void setLocaleContext(HttpServletRequest request, HttpServletResponse response, LocaleContext localeContext) {
        throw new UnsupportedOperationException(
                "Cannot change HTTP accept header - use a different locale resolution strategy");
    }
}
