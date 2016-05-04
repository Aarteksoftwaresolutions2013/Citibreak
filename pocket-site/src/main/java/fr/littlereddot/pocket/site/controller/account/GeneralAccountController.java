package fr.littlereddot.pocket.site.controller.account;

import fr.littlereddot.pocket.client.resource.UserResource;
import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.site.controller.AbstractController;
import fr.littlereddot.pocket.site.dto.UpdateProfileResponse;
import fr.littlereddot.pocket.site.dto.UpdateUser;
import fr.littlereddot.pocket.site.entity.SearchParams;
import fr.littlereddot.pocket.site.service.MailService;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Controller
@RequestMapping("/account/general")
@PreAuthorize("isAuthenticated()")
public class GeneralAccountController extends AbstractController {
    @Autowired
    private ApplicationContext context;
    @Autowired
    private UserResource userResource;
    @Autowired
    private MailService mailService;
    @Autowired
    private SearchParams searchParams;

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public UpdateProfileResponse save(final Authentication principal, UpdateUser updateUser) {
        if (updateUser == null) {
            return new UpdateProfileResponse(false, "accountEmail", context.getMessage("common.validation.required", null, "required", countryParam.getLocale()));
        }

        final User currentUser = getUser(principal);
        User email = userResource.getByEmail(updateUser.getEmail());
        if (email != null && !email.getId().equals(currentUser.getId())) {
            return new UpdateProfileResponse(false, "accountEmail", context.getMessage("common.validation.email.exists", null, "already exists", countryParam.getLocale()));
        }

        boolean updatePassword = !StringUtils.isEmpty(updateUser.getPassword()) || !StringUtils.isEmpty(updateUser.getNewPassword()) || !StringUtils.isEmpty(updateUser.getConfirmPassword());
        if (updatePassword) {
            if (!StringUtils.equals(currentUser.getPassword(), updateUser.getPassword())) {
                return new UpdateProfileResponse(false, "accountPassword", context.getMessage("common.validation.equalTo", null, "password does not match", countryParam.getLocale()));
            }
            if (StringUtils.isBlank(updateUser.getNewPassword())) {
                return new UpdateProfileResponse(false, "accountNewPassword", context.getMessage("common.validation.required", null, "required", countryParam.getLocale()));
            }
            if (StringUtils.isBlank(updateUser.getConfirmPassword())) {
                return new UpdateProfileResponse(false, "accountConfirmPassword", context.getMessage("common.validation.required", null, "required", countryParam.getLocale()));
            }
            if (!StringUtils.equals(updateUser.getNewPassword(), updateUser.getConfirmPassword())) {
                return new UpdateProfileResponse(false, "accountConfirmPassword", context.getMessage("common.validation.equalTo", null, "password does not match", countryParam.getLocale()));
            }
        }

        User user = userResource.get(currentUser.getId().toString());
        if (updatePassword) {
            user.setPassword(updateUser.getNewPassword());
            currentUser.setPassword(updateUser.getNewPassword());
            user.setLastPasswordUpdateDate(new LocalDateTime(searchParams.getDateTimeZone()).toDate());
            currentUser.setLastPasswordUpdateDate(new LocalDateTime(searchParams.getDateTimeZone()).toDate());
        }

        user.setEmail(updateUser.getEmail());
        currentUser.setEmail(updateUser.getEmail());
        userResource.save(user);
        mailService.sendMail(user, countryParam.getLocale(), "account-updated");
        return new UpdateProfileResponse(true);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "home";
    }
}
