package fr.littlereddot.pocket.site.controller.account;

import fr.littlereddot.pocket.client.resource.UserResource;
import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.site.controller.AbstractController;
import fr.littlereddot.pocket.site.dto.UpdateProfileResponse;
import fr.littlereddot.pocket.site.dto.UpdateUser;
import fr.littlereddot.pocket.site.service.MailService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Controller
@RequestMapping("/account/delete")
@PreAuthorize("isAuthenticated()")
public class DeleteAccountController extends AbstractController {
    @Autowired
    private ApplicationContext context;
    @Autowired
    private UserResource userResource;
    @Autowired
    private MailService mailService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public UpdateProfileResponse save(final Authentication principal, @RequestParam("password") String currentPassword) {
        final User currentUser = getUser(principal);
        if (!StringUtils.equals(currentUser.getPassword(), currentPassword)) {
            return new UpdateProfileResponse(false, "accountPassword", context.getMessage("common.validation.equalTo", null, "password does not match.", LocaleContextHolder.getLocale()));
        }
        userResource.delete(currentUser.getId().toString());
        mailService.sendMail(currentUser, countryParam.getLocale(), "account-deleted");
        SecurityContextHolder.clearContext();
        return new UpdateProfileResponse(true);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "home";
    }
}
