package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.client.resource.UserResource;
import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.site.dto.RegisterResponse;
import fr.littlereddot.pocket.site.service.MailService;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/reset-password")
public class ResetPasswordController extends AbstractController {

    @Autowired
    private ApplicationContext context;
    @Autowired
    private UserResource userResource;
    @Autowired
    private MailService mailService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public RegisterResponse resetPassword(String email) {
        if (StringUtils.isEmpty(email)) {
            return new RegisterResponse(false, "resetEmail", context.getMessage("common.validation.required", null, "required", LocaleContextHolder.getLocale()));
        }
        User user = userResource.getByEmail(email);
        if (user == null) {
            return new RegisterResponse(false, "resetEmail", context.getMessage("common.validation.email.not.found", null, "not found", LocaleContextHolder.getLocale()));
        }
        user.setPassword(RandomStringUtils.randomAlphanumeric(8));
        User currentUser = userResource.save(user);
        mailService.sendMail(currentUser, countryParam.getLocale(), "password-reset");
        return new RegisterResponse(true);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
