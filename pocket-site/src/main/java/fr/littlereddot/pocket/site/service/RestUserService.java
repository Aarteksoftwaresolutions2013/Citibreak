package fr.littlereddot.pocket.site.service;

import fr.littlereddot.pocket.client.resource.UserResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.social.security.SocialUserDetails;
import org.springframework.social.security.SocialUserDetailsService;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
public class RestUserService implements UserDetailsService, SocialUserDetailsService {
    @Autowired
    private UserResource userResource;

    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        return userResource.getByEmail(name);
    }

    @Override
    public SocialUserDetails loadUserByUserId(String userId) throws UsernameNotFoundException, DataAccessException {
        return userResource.getByEmail(userId);
    }
}
