package fr.littlereddot.pocket.site.config;

import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.AsyncHttpClientConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.zendesk.client.v2.Zendesk;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Configuration
public class ZendeskConfig {
    @Value("${zendesk.username}")
    private String zendeskUsername;
    @Value("${zendesk.token}")
    private String zendeskToken;
    @Value("${zendesk.domain}")
    private String zendeskDomain;

    @Bean
    public Zendesk.Builder zendeskBuilder() {
        AsyncHttpClientConfig config = new AsyncHttpClientConfig.Builder()
                .setMaxRequestRetry(1)
                .build();
        return new Zendesk.Builder(zendeskDomain)
                .setClient(new AsyncHttpClient(config))
                .setUsername(zendeskUsername)
                .setToken(zendeskToken);
    }
}
