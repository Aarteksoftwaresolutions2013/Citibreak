package fr.littlereddot.pocket.site.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/legals")
public class LegalsController extends AbstractController {

    @RequestMapping(method = RequestMethod.GET)
    public String login(final HttpServletRequest request) {
        navigationParam.appendPath(request);
        return "legals";
    }


    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
