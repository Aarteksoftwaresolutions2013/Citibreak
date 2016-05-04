package fr.littlereddot.pocket.site.config;

import fr.littlereddot.pocket.site.converter.LocalDateConverter;
import fr.littlereddot.pocket.site.converter.LocalTimeConverter;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.ErrorPage;
import org.springframework.boot.context.embedded.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.tuckey.web.filters.urlrewrite.UrlRewriteFilter;

@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

    @Bean
    public LocaleResolver localeResolver() {
        return new TldLocaleResolver();
    }

    @Bean
    public TldInterceptor tldInterceptor() {
        return new TldInterceptor();
    }

    @Bean
    public CharacterEncodingFilter characterEncodingFilter() {
        CharacterEncodingFilter filter = new CharacterEncodingFilter();
        filter.setEncoding("UTF-8");
        filter.setForceEncoding(true);
        return filter;
    }

    @Bean
    public FilterRegistrationBean filterRegistrationBean() {
        FilterRegistrationBean registrationBean = new FilterRegistrationBean();
        registrationBean.setName(UrlRewriteFilter.class.getSimpleName());
        registrationBean.setFilter(new UrlRewriteFilter());
        registrationBean.addInitParameter("confPath", "rewrite.xml");
        registrationBean.addInitParameter("statusPath", "/rewrite-status");
        registrationBean.addInitParameter("statusEnabledOnHosts", "*");
        registrationBean.addInitParameter("logLevel", "WARN");
        return registrationBean;
    }

    @Bean
    public EmbeddedServletContainerCustomizer containerCustomizer() {
        return new EmbeddedServletContainerCustomizer() {
            @Override
            public void customize(ConfigurableEmbeddedServletContainer container) {
                ErrorPage error404Page = new ErrorPage(HttpStatus.NOT_FOUND, "/404");
                container.addErrorPages(error404Page);
            }
        };
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        super.addFormatters(registry);
        registry.addConverter(new LocalDateConverter());
        registry.addConverter(new LocalTimeConverter());
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //registry.addInterceptor(tldInterceptor());
        super.addInterceptors(registry);
    }
}