package fr.littlereddot.pocket.site.config;

import fr.littlereddot.pocket.client.config.ResourceConfig;
import fr.littlereddot.pocket.site.controller.AssistantController;
import fr.littlereddot.pocket.site.entity.SearchParams;
import fr.littlereddot.pocket.site.service.SearchService;
import org.joda.time.DateTimeZone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@EnableAutoConfiguration
@EnableConfigurationProperties
@Configuration("applicationConfig")
@ComponentScan(basePackageClasses = {AssistantController.class, SearchService.class, SearchParams.class})
@Import({WebConfig.class, SecurityConfig.class, ResourceConfig.class, MailConfig.class, ZendeskConfig.class, FoursquareConfig.class})
public class ApplicationConfig {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationConfig.class, args);
    }

    @PostConstruct
    public void initTimezone() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        DateTimeZone.setDefault(DateTimeZone.UTC);
        org.elasticsearch.common.joda.time.DateTimeZone.setDefault(org.elasticsearch.common.joda.time.DateTimeZone.UTC);
    }
}
