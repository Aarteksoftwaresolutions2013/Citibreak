package fr.littlereddot.pocket.site.controller.account;

import fr.littlereddot.pocket.client.resource.UserFileResource;
import fr.littlereddot.pocket.client.resource.UserResource;
import fr.littlereddot.pocket.core.dto.response.UserFileResultDto;
import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.site.controller.AbstractController;
import fr.littlereddot.pocket.site.dto.UpdateProfile;
import fr.littlereddot.pocket.site.dto.UpdateProfileResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Controller
@RequestMapping("/account/profile")
@PreAuthorize("isAuthenticated()")
public class ProfileAccountController extends AbstractController {
    @Autowired
    private ApplicationContext context;
    @Autowired
    private UserResource userResource;
    @Autowired
    private UserFileResource userFileResource;

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public UpdateProfileResponse save(final Authentication principal, final UpdateProfile updateProfile) throws IOException {
        if (updateProfile == null || StringUtils.isBlank(updateProfile.getName())) {
            return new UpdateProfileResponse(false, "accountName", context.getMessage("common.validation.required", null, "required", countryParam.getLocale()));
        }
        final User currentUser = getUser(principal);
        User user = userResource.get(currentUser.getId().toString());
        user.setName(updateProfile.getName());
        currentUser.setName(updateProfile.getName());
        user.setNewsletterSubscriber(updateProfile.getNewsletterSubscription());
        currentUser.setNewsletterSubscriber(updateProfile.getNewsletterSubscription());
        userResource.save(user);
        UserFileResultDto userFileResultDto = null;
        if (StringUtils.isNotBlank(updateProfile.getDefaultAvatar())) {
            userFileResultDto = userFileResource.save(user.getId(), updateProfile.getDefaultAvatar());
        } else if (updateProfile.getAvatar() != null) {
            userFileResultDto = userFileResource.upload(user.getId(), updateProfile.getAvatar());
        }
        if (userFileResultDto != null) {
            currentUser.setAvatarUrl(userFileResultDto.getFileUrl());
        }
        return new UpdateProfileResponse(true);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "home";
    }
}
