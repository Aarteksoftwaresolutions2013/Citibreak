package fr.littlereddot.pocket.site.service;

import com.rosaloves.bitlyj.Bitly;
import com.rosaloves.bitlyj.Url;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
@Service
public class UrlShortener {

    @Value("${bitly.api.username}")
    private String userName;
    @Value("${bitly.api.key}")
    private String apiKey;

    public String shorten(String longUrl) {
        Url url = Bitly.as(userName, apiKey).call(Bitly.shorten(longUrl));
        return url.getShortUrl();
    }

}
