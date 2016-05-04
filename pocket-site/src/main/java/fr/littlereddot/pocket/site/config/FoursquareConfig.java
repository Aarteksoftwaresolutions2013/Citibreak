package fr.littlereddot.pocket.site.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
@Configuration
public class FoursquareConfig {

    @Value("${foursquare.api.key}")
    private String apiKey;
    @Value("${foursquare.api.secret}")
    private String apiSecret;
    @Value("${foursquare.api.token}")
    private String token;
    @Value("${foursquare.api.callbackUrl}")
    private String callbackUrl;

    public String getApiKey() {
        return apiKey;
    }

    public String getApiSecret() {
        return apiSecret;
    }

    public String getToken() {
        return token;
    }

    public String getCallbackUrl() {
        return callbackUrl;
    }
}
