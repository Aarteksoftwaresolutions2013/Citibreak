package fr.littlereddot.pocket.site.config;

import org.scribe.builder.api.DefaultApi10a;
import org.scribe.model.Token;

/**
* @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
* @version $Id$
*/
public class TwoStepOAuth extends DefaultApi10a {

    public TwoStepOAuth() {
    }

    @Override
    public String getAccessTokenEndpoint() {
        return null;
    }

    @Override
    public String getAuthorizationUrl(Token arg0) {
        return null;
    }

    @Override
    public String getRequestTokenEndpoint() {
        return null;
    }
}
