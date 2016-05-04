package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.site.entity.SearchParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/account")
@PreAuthorize("isAuthenticated()")
public class AccountController extends AbstractController {

    @Autowired
    private SearchParams searchParams;

    @RequestMapping(method = RequestMethod.GET)
    public String menu(final HttpServletRequest request) {
        return "account/menu";
    }

    @RequestMapping(value = "/general", method = RequestMethod.GET)
    public String general(final HttpServletRequest request) {
        navigationParam.updatePath(request, 0);
        return "account/general";
    }

    @RequestMapping(value = "/profile", method = RequestMethod.GET)
    public String profile(final HttpServletRequest request) {
        navigationParam.updatePath(request, 0);
        return "account/profile";
    }

    @RequestMapping(value = "/activity", method = RequestMethod.GET)
    public String activity(final HttpServletRequest request) {
        navigationParam.updatePath(request, 0);
        return "account/activity";
    }

    @RequestMapping(value = "/delete", method = RequestMethod.GET)
    public String delete(final HttpServletRequest request) {
        navigationParam.updatePath(request, 0);
        return "account/delete";
    }

    @ModelAttribute("searchParams")
    public SearchParams getSearchParams() {
        return searchParams;
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "account";
    }
}
