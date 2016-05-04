package fr.littlereddot.pocket.site.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import fr.littlereddot.pocket.client.resource.ApplicationResource;
import fr.littlereddot.pocket.client.resource.EventResource;
import fr.littlereddot.pocket.client.resource.SiteResource;
import fr.littlereddot.pocket.core.entity.Application;
import fr.littlereddot.pocket.core.entity.Event;
import fr.littlereddot.pocket.core.entity.Site;

@Controller
@RequestMapping("/application/{id}")
/**
 * @author DKhvatov
 */
public class ApplicationController extends AbstractController {

    @Autowired
    private ApplicationResource applicationResource;
    @Autowired
    private SiteResource siteResource;
    @Autowired
    private EventResource eventResource;

    @RequestMapping(method = RequestMethod.GET)
    public String index(final Model model, @PathVariable("id") String applicationId) {
        Application application = applicationResource.get(applicationId);
        Site site = null;
        if (application.getSiteId() != null) {
            site = siteResource.get(application.getSiteId().toString());
        }
        Event event = null;
        if (application.getEventId() != null) {
            event = eventResource.get(application.getEventId().toString());
        }
        model.addAttribute("site", site);
        model.addAttribute("event", event);
        model.addAttribute("application", application);
        return "application";
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
