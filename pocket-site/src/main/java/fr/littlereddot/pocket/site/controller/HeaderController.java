package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.client.resource.SearchResource;
import fr.littlereddot.pocket.core.dto.response.CitiesResponseDto;
import fr.littlereddot.pocket.core.dto.response.SitesResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/search")
public class HeaderController extends AbstractController {

    @Autowired
    private SearchResource searchResource;

    @ResponseBody
    @RequestMapping("/fuzzy")
    public SitesResponseDto fuzzy(@RequestParam("query") String query) {
        return searchResource.fuzzy(query);
    }

    @ResponseBody
    @RequestMapping("/cities")
    public CitiesResponseDto cities(@RequestParam("query") String query) {
        return searchResource.cities(query);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
