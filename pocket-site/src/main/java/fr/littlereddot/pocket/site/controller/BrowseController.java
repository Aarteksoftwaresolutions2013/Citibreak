package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.core.comparator.BaseSiteComparator;
import fr.littlereddot.pocket.core.dto.response.SitesResponseDto;
import fr.littlereddot.pocket.site.entity.SearchParams;
import fr.littlereddot.pocket.site.entity.TagsParams;
import fr.littlereddot.pocket.site.service.SearchService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.Date;

@Controller
@RequestMapping("/browse")
public class BrowseController extends AbstractController {

    @Autowired
    private SearchService searchService;
    @Autowired
    private TagsParams tagsParams;
    @Autowired
    private SearchParams searchParams;

    @RequestMapping(value = "/{category}", method = RequestMethod.GET)
    public String category(final Model model, final HttpServletRequest request, @PathVariable final String category) {
        String indexType = StringUtils.equalsIgnoreCase(category, "exhibition") ? "event" : "site";
        SitesResponseDto result = searchService.search(indexType, true, category, searchParams, null);

        Date searchDate = searchParams.getDateTime().toDate();
        Collections.sort(result.getSites(), new BaseSiteComparator(searchDate));

        model.addAttribute("sitesResponseDto", result);
        model.addAttribute("indexType", indexType);
        model.addAttribute("showDescription", true);
        navigationParam.updatePath(request, 1);
        return "search";
    }

    @ModelAttribute("tagsParams")
    public TagsParams getTagsParams() {
        return tagsParams;
    }

    @ModelAttribute("searchParams")
    public SearchParams getSearchParams() {
        return searchParams;
    }

    @ModelAttribute("category")
    public String getCategory(@PathVariable final String category) {
        return category;
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage(@PathVariable final String category) {
        return "browse." + category;
    }
}
