package fr.littlereddot.pocket.site.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.littlereddot.pocket.client.resource.NewsletterResource;
import fr.littlereddot.pocket.core.entity.Newsletter;
import fr.littlereddot.pocket.site.dto.NewsletterSubscriptionResponse;

/**
 * @author DKhvatov
 */
@Controller
@RequestMapping("/newsletter")
public class NewsletterController extends AbstractController {

    @Autowired
    private ApplicationContext context;
    @Autowired
    private NewsletterResource newsletterResource;

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public NewsletterSubscriptionResponse save(@RequestParam(value = "email") final String email) {
        if (newsletterResource.exists(email)) {
            return NewsletterSubscriptionResponse.error(
                    context.getMessage("newsletter.subscribe.error.exists", null, "You have already subscribed to Citibreak newsletter", LocaleContextHolder.getLocale()));
        }

        Newsletter newsletter = new Newsletter();
        newsletter.setEmail(email);
        if (newsletterResource.save(newsletter) == null) {
            return NewsletterSubscriptionResponse.error(context.getMessage("common.validation.email.exists", null, "already exists", LocaleContextHolder.getLocale()));
        } else {
            return NewsletterSubscriptionResponse.success();
        }
    }

}
