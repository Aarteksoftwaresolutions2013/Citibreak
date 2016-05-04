package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.client.resource.UserFileResource;
import fr.littlereddot.pocket.client.resource.UserResource;
import fr.littlereddot.pocket.core.dto.response.UserFileResultDto;
import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.site.dto.RegisterResponse;
import fr.littlereddot.pocket.site.dto.RegisterUser;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/register")
public class RegisterController extends AbstractController {

    @Autowired
    private ApplicationContext context;
    @Autowired
    private UserResource userResource;
    @Autowired
    private UserFileResource userFileResource;
    @Autowired
    @Qualifier("siteAuthenticationManager")
    private AuthenticationManager authenticationManager;

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public RegisterResponse register(RegisterUser registerUser) {
        if (registerUser == null) {
            return new RegisterResponse(false, "registerName", context.getMessage("common.validation.required", null, "required", LocaleContextHolder.getLocale()));
        }
        if (!StringUtils.equals(registerUser.getPassword(), registerUser.getConfirmPassword())) {
            return new RegisterResponse(false, "registerConfirmPassword", context.getMessage("common.validation.equalTo", null, "password does not match.", LocaleContextHolder.getLocale()));
        }
        if (!registerUser.isTerms()) {
            return new RegisterResponse(false, "registerTerms", context.getMessage("common.validation.required", null, "required", LocaleContextHolder.getLocale()));
        }
        User email = userResource.getByEmail(registerUser.getEmail());
        if (email != null) {
            return new RegisterResponse(false, "registerEmail", context.getMessage("common.validation.email.exists", null, "already exists", LocaleContextHolder.getLocale()));
        }
        User user = new User();
        user.setName(registerUser.getName());
        user.setPassword(registerUser.getPassword());
        user.setEmail(registerUser.getEmail());
        User currentUser = userResource.save(user);
        UserFileResultDto userFileResultDto = null;
        if (StringUtils.isNotBlank(registerUser.getDefaultAvatar())) {
            userFileResultDto = userFileResource.save(currentUser.getId(), registerUser.getDefaultAvatar());
        } else if (registerUser.getAvatar() != null) {
            userFileResultDto = userFileResource.upload(currentUser.getId(), registerUser.getAvatar());
        }
        if (userFileResultDto != null) {
            currentUser.setAvatarUrl(userFileResultDto.getFileUrl());
        }
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(currentUser.getEmail(), currentUser.getPassword(), currentUser.getAuthorities()));
        if (authentication.isAuthenticated()) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        return new RegisterResponse(true);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
