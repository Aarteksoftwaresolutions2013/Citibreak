/*
 * Copyright 2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package fr.littlereddot.pocket.site.controller.account;

import fr.littlereddot.pocket.site.config.AccountConnectSupport;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionFactory;
import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.ConnectionKey;
import org.springframework.social.connect.ConnectionRepository;
import org.springframework.social.connect.DuplicateConnectionException;
import org.springframework.social.connect.support.OAuth1ConnectionFactory;
import org.springframework.social.connect.support.OAuth2ConnectionFactory;
import org.springframework.social.connect.web.ConnectController;
import org.springframework.social.connect.web.ConnectSupport;
import org.springframework.social.connect.web.HttpSessionSessionStrategy;
import org.springframework.social.connect.web.SessionStrategy;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.view.RedirectView;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Generic UI controller for managing the account-to-service-provider connection flow.
 * <ul>
 * <li>GET /connect/{providerId}  - Get a web page showing connection status to {providerId}.</li>
 * <li>POST /connect/{providerId} - Initiate an connection with {providerId}.</li>
 * <li>GET /connect/{providerId}?oauth_verifier||code - Receive {providerId} authorization callback and establish the connection.</li>
 * <li>DELETE /connect/{providerId} - Disconnect from {providerId}.</li>
 * </ul>
 *
 * @author Keith Donald
 * @author Craig Walls
 * @author Roy Clarkson
 */
@Controller
@RequestMapping("/account/connect")
public class ConnectAccountController implements InitializingBean {

    private final static Log logger = LogFactory.getLog(ConnectController.class);

    private final ConnectionFactoryLocator connectionFactoryLocator;

    private final ConnectionRepository connectionRepository;

    private ConnectSupport connectSupport;

    private SessionStrategy sessionStrategy = new HttpSessionSessionStrategy();

    /**
     * Constructs a ConnectController.
     *
     * @param connectionFactoryLocator the locator for {@link org.springframework.social.connect.ConnectionFactory} instances needed to establish connections
     * @param connectionRepository     the current user's {@link ConnectionRepository} needed to persist connections; must be a proxy to a request-scoped bean
     */
    @Inject
    public ConnectAccountController(ConnectionFactoryLocator connectionFactoryLocator, ConnectionRepository connectionRepository) {
        this.connectionFactoryLocator = connectionFactoryLocator;
        this.connectionRepository = connectionRepository;
    }

    /**
     * Render the status of the connections to the service provider to the user as HTML in their web browser.
     */
    @RequestMapping(value = "/{providerId}", method = RequestMethod.GET)
    public String connectionStatus(@PathVariable String providerId, NativeWebRequest request, Model model) {
        setNoCache(request);
        processFlash(request, model);
        List<Connection<?>> connections = connectionRepository.findConnections(providerId);
        setNoCache(request);
        if (connections.isEmpty()) {
            return connectView(providerId);
        } else {
            model.addAttribute("connections", connections);
            return connectedView(providerId);
        }
    }

    /**
     * Process a connect form submission by commencing the process of establishing a connection to the provider on behalf of the member.
     * For OAuth1, fetches a new request token from the provider, temporarily stores it in the session, then redirects the member to the provider's site for authorization.
     * For OAuth2, redirects the user to the provider's site for authorization.
     */
    @RequestMapping(value = "/{providerId}", method = RequestMethod.POST)
    public RedirectView connect(@PathVariable String providerId, NativeWebRequest request) {
        ConnectionFactory<?> connectionFactory = connectionFactoryLocator.getConnectionFactory(providerId);
        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        try {
            return new RedirectView(connectSupport.buildOAuthUrl(connectionFactory, request, parameters));
        } catch (Exception e) {
            sessionStrategy.setAttribute(request, PROVIDER_ERROR_ATTRIBUTE, e);
            return connectionStatusRedirect(providerId, request);
        }
    }

    /**
     * Process the authorization callback from an OAuth 1 service provider.
     * Called after the user authorizes the connection, generally done by having he or she click "Allow" in their web browser at the provider's site.
     * On authorization verification, connects the user's local account to the account they hold at the service provider
     * Removes the request token from the session since it is no longer valid after the connection is established.
     */
    @RequestMapping(value = "/{providerId}", method = RequestMethod.GET, params = "oauth_token")
    public RedirectView oauth1Callback(@PathVariable String providerId, NativeWebRequest request) {
        try {
            OAuth1ConnectionFactory<?> connectionFactory = (OAuth1ConnectionFactory<?>) connectionFactoryLocator.getConnectionFactory(providerId);
            Connection<?> connection = connectSupport.completeConnection(connectionFactory, request);
            addConnection(connection, connectionFactory, request);
        } catch (Exception e) {
            sessionStrategy.setAttribute(request, PROVIDER_ERROR_ATTRIBUTE, e);
            logger.warn("Exception while handling OAuth1 callback (" + e.getMessage() + "). Redirecting to " + providerId + " connection status page.");
        }
        return connectionStatusRedirect(providerId, request);
    }

    /**
     * Process the authorization callback from an OAuth 2 service provider.
     * Called after the user authorizes the connection, generally done by having he or she click "Allow" in their web browser at the provider's site.
     * On authorization verification, connects the user's local account to the account they hold at the service provider.
     */
    @RequestMapping(value = "/{providerId}", method = RequestMethod.GET, params = "code")
    public RedirectView oauth2Callback(@PathVariable String providerId, NativeWebRequest request) {
        try {
            OAuth2ConnectionFactory<?> connectionFactory = (OAuth2ConnectionFactory<?>) connectionFactoryLocator.getConnectionFactory(providerId);
            Connection<?> connection = connectSupport.completeConnection(connectionFactory, request);
            addConnection(connection, connectionFactory, request);
        } catch (Exception e) {
            sessionStrategy.setAttribute(request, PROVIDER_ERROR_ATTRIBUTE, e);
            logger.warn("Exception while handling OAuth2 callback (" + e.getMessage() + "). Redirecting to " + providerId + " connection status page.");
        }
        return connectionStatusRedirect(providerId, request);
    }

    /**
     * Process an error callback from an OAuth 2 authorization as described at http://tools.ietf.org/html/rfc6749#section-4.1.2.1.
     * Called after upon redirect from an OAuth 2 provider when there is some sort of error during authorization, typically because the user denied authorization.
     */
    @RequestMapping(value = "/{providerId}", method = RequestMethod.GET, params = "error")
    public RedirectView oauth2ErrorCallback(@PathVariable String providerId,
                                            @RequestParam("error") String error,
                                            @RequestParam(value = "error_description", required = false) String errorDescription,
                                            @RequestParam(value = "error_uri", required = false) String errorUri,
                                            NativeWebRequest request) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("error", error);
        if (errorDescription != null) {
            errorMap.put("errorDescription", errorDescription);
        }
        if (errorUri != null) {
            errorMap.put("errorUri", errorUri);
        }
        sessionStrategy.setAttribute(request, AUTHORIZATION_ERROR_ATTRIBUTE, errorMap);
        return connectionStatusRedirect(providerId, request);
    }

    /**
     * Remove all provider connections for a user account.
     * The user has decided they no longer wish to use the service provider from this application.
     * Note: requires {@link org.springframework.web.filter.HiddenHttpMethodFilter} to be registered with the '_method' request parameter set to 'DELETE' to convert web browser POSTs to DELETE requests.
     */
    @RequestMapping(value = "/{providerId}", method = RequestMethod.DELETE)
    public RedirectView removeConnections(@PathVariable String providerId, NativeWebRequest request) {
        connectionRepository.removeConnections(providerId);
        return connectionStatusRedirect(providerId, request);
    }

    /**
     * Remove a single provider connection associated with a user account.
     * The user has decided they no longer wish to use the service provider account from this application.
     * Note: requires {@link org.springframework.web.filter.HiddenHttpMethodFilter} to be registered with the '_method' request parameter set to 'DELETE' to convert web browser POSTs to DELETE requests.
     */
    @RequestMapping(value = "/{providerId}/{providerUserId}", method = RequestMethod.DELETE)
    public RedirectView removeConnection(@PathVariable String providerId, @PathVariable String providerUserId, NativeWebRequest request) {
        connectionRepository.removeConnection(new ConnectionKey(providerId, providerUserId));
        return connectionStatusRedirect(providerId, request);
    }

    /**
     * Returns the view name of a page to display for a provider when the user is not connected to the provider.
     * Typically this page would offer the user an opportunity to create a connection with the provider.
     * Defaults to "connect/{providerId}Connect". May be overridden to return a custom view name.
     *
     * @param providerId the ID of the provider to display the connection status for.
     */
    protected String connectView(String providerId) {
        return "/";
    }

    /**
     * Returns the view name of a page to display for a provider when the user is connected to the provider.
     * Typically this page would allow the user to disconnect from the provider.
     * Defaults to "connect/{providerId}Connected". May be overridden to return a custom view name.
     *
     * @param providerId the ID of the provider to display the connection status for.
     */
    protected String connectedView(String providerId) {
        return "/";
    }

    /**
     * Returns a RedirectView with the URL to redirect to after a connection is created or deleted.
     * Defaults to "/connect/{providerId}" relative to DispatcherServlet's path.
     * May be overridden to handle custom redirection needs.
     *
     * @param providerId the ID of the provider for which a connection was created or deleted.
     * @param request    the NativeWebRequest used to access the servlet path when constructing the redirect path.
     */
    protected RedirectView connectionStatusRedirect(String providerId, NativeWebRequest request) {
        String origin = request.getParameter("origin");
        String parameterSeparator = StringUtils.contains(origin, "?") ? "&" : "?";
        return new RedirectView(origin + parameterSeparator + providerId + "=true");
    }

    // From InitializingBean
    public void afterPropertiesSet() throws Exception {
        this.connectSupport = new AccountConnectSupport(sessionStrategy);
    }

    private void addConnection(Connection<?> connection, ConnectionFactory<?> connectionFactory, WebRequest request) {
        try {
            connectionRepository.addConnection(connection);
        } catch (DuplicateConnectionException e) {
            sessionStrategy.setAttribute(request, DUPLICATE_CONNECTION_ATTRIBUTE, e);
        }
    }

    private void processFlash(WebRequest request, Model model) {
        convertSessionAttributeToModelAttribute(DUPLICATE_CONNECTION_ATTRIBUTE, request, model);
        convertSessionAttributeToModelAttribute(PROVIDER_ERROR_ATTRIBUTE, request, model);
        model.addAttribute(AUTHORIZATION_ERROR_ATTRIBUTE, sessionStrategy.getAttribute(request, AUTHORIZATION_ERROR_ATTRIBUTE));
        sessionStrategy.removeAttribute(request, AUTHORIZATION_ERROR_ATTRIBUTE);
    }

    private void convertSessionAttributeToModelAttribute(String attributeName, WebRequest request, Model model) {
        if (sessionStrategy.getAttribute(request, attributeName) != null) {
            model.addAttribute(attributeName, Boolean.TRUE);
            sessionStrategy.removeAttribute(request, attributeName);
        }
    }

    private void setNoCache(NativeWebRequest request) {
        HttpServletResponse response = request.getNativeResponse(HttpServletResponse.class);
        if (response != null) {
            response.setHeader("Pragma", "no-cache");
            response.setDateHeader("Expires", 1L);
            response.setHeader("Cache-Control", "no-cache");
            response.addHeader("Cache-Control", "no-store");
        }
    }

    private static final String DUPLICATE_CONNECTION_ATTRIBUTE = "social_addConnection_duplicate";

    private static final String PROVIDER_ERROR_ATTRIBUTE = "social_provider_error";

    private static final String AUTHORIZATION_ERROR_ATTRIBUTE = "social_authorization_error";
}
