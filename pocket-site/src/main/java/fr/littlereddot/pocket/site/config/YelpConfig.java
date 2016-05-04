package fr.littlereddot.pocket.site.config;

import org.scribe.builder.ServiceBuilder;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.oauth.OAuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
@Configuration
public class YelpConfig {

    @Value("${yelp.api.key}")
    private String apiKey;
    @Value("${yelp.api.secret}")
    private String apiSecret;
    @Value("${yelp.api.token}")
    private String token;
    @Value("${yelp.api.token.secret}")
    private String tokenSecret;

    @Bean
    public YelpClient yelpClient() {
        return new YelpClient(this);
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getApiSecret() {
        return apiSecret;
    }

    public String getToken() {
        return token;
    }

    public String getTokenSecret() {
        return tokenSecret;
    }

    /**
     * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
     * @version $Id$
     */
    public static class YelpClient {

        private static final String YELP_SEARCH_ENDPOINT = "http://api.yelp.com/v2/search";
        private static final String YELP_BUSINESS_ENDPOINT = "http://api.yelp.com/v2/business/";

        private OAuthService service;
        private Token accessToken;

        public YelpClient(YelpConfig yelpConfig) {
            service = new ServiceBuilder().provider(TwoStepOAuth.class).apiKey(yelpConfig.getApiKey()).apiSecret(yelpConfig.getApiSecret()).build();
            accessToken = new Token(yelpConfig.getToken(), yelpConfig.getTokenSecret());
        }

        public String search(Map<String, String> params) {
            return get(YELP_SEARCH_ENDPOINT, params);
        }

        public String getBusiness(String id, Map<String, String> params) {
            return get(YELP_BUSINESS_ENDPOINT + id, params);
        }

        private String get(String path, Map<String, String> params) {
            OAuthRequest request = new OAuthRequest(Verb.GET, path);
            for (Map.Entry<String, String> param : params.entrySet()) {
                request.addQuerystringParameter(param.getKey(), param.getValue());
            }
            service.signRequest(accessToken, request);
            Response response = request.send();
            return response.getBody();
        }

    }
}
