package fr.littlereddot.pocket.site.entity;

import com.google.common.collect.Lists;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CountryParam {
    private static final String DEFAULT_LANGUAGE = "en";
    private static final List<String> availableLanguages = Lists.newArrayList("en", "fr");
    private Locale locale;
    private String language;
    private String country;

    public CountryParam() {
        this.locale = LocaleContextHolder.getLocale();
        if (availableLanguages.contains(locale.getLanguage())) {
            this.language = locale.getLanguage();
        } else {
            this.language = DEFAULT_LANGUAGE;
        }
        this.country = locale.getCountry();
    }

    public Locale getLocale() {
        return locale;
    }

    public void setLocale(Locale locale) {
        this.locale = locale;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
