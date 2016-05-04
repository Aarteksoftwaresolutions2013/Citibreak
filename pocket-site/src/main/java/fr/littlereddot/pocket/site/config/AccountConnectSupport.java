package fr.littlereddot.pocket.site.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.social.connect.web.ConnectSupport;
import org.springframework.social.connect.web.SessionStrategy;
import org.springframework.web.context.request.NativeWebRequest;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
public class AccountConnectSupport extends ConnectSupport {

    public AccountConnectSupport(SessionStrategy sessionStrategy) {
        super(sessionStrategy);
    }

    @Override
    protected String callbackUrl(NativeWebRequest request) {
        String redirect = super.callbackUrl(request);
        String originParameter = "/";
        try {
            originParameter = URLEncoder.encode(request.getParameter("origin"), "UTF-8");
        } catch (UnsupportedEncodingException ignored) {}
        String parameterSeparator = StringUtils.contains(redirect, "?") ? "&" : "?";
        return redirect + parameterSeparator + "origin=" + originParameter;
    }
}
