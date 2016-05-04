package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.client.resource.ArticleResource;
import fr.littlereddot.pocket.client.resource.EventResource;
import fr.littlereddot.pocket.client.resource.SiteResource;
import fr.littlereddot.pocket.core.entity.Article;
import fr.littlereddot.pocket.core.entity.BaseSite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

@Controller
public class ErrorController extends AbstractController {

    @Autowired
    private ArticleResource articleResource;
    @Autowired
    private SiteResource siteResource;
    @Autowired
    private EventResource eventResource;

    @RequestMapping("/404")
    public String error() {
        return "404";
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
