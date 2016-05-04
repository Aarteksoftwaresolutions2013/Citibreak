package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.client.resource.ArticleResource;
import fr.littlereddot.pocket.client.resource.EventResource;
import fr.littlereddot.pocket.client.resource.SiteResource;
import fr.littlereddot.pocket.core.entity.Article;
import fr.littlereddot.pocket.core.entity.BaseSite;
import fr.littlereddot.pocket.core.entity.Event;
import fr.littlereddot.pocket.core.entity.Site;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/article/{id}")
public class ArticleController extends AbstractController {

    @Autowired
    private ArticleResource articleResource;
    @Autowired
    private SiteResource siteResource;
    @Autowired
    private EventResource eventResource;

    @RequestMapping(method = RequestMethod.GET)
    public String index(final Model model, @PathVariable("id") String articleId) {
        Article article = articleResource.get(articleId);
        Site site = null;
        if (article.getSiteId() != null) {
            site = siteResource.get(article.getSiteId().toString());
        }
        Event event = null;
        if (article.getEventId() != null) {
            event = eventResource.get(article.getEventId().toString());
        }
        model.addAttribute("site", site);
        model.addAttribute("event", event);
        model.addAttribute("article", article);
        return "article";
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
