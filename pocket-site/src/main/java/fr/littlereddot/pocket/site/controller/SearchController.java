package fr.littlereddot.pocket.site.controller;

import com.google.appengine.repackaged.com.google.common.collect.FluentIterable;
import com.google.appengine.repackaged.com.google.common.collect.Iterables;
import fr.littlereddot.pocket.core.comparator.BaseSiteComparator;
import fr.littlereddot.pocket.core.dto.response.SitesResponseDto;
import fr.littlereddot.pocket.site.entity.SearchParams;
import fr.littlereddot.pocket.site.entity.TagsParams;
import fr.littlereddot.pocket.site.service.DataService;
import fr.littlereddot.pocket.site.service.SearchService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.Date;
import java.util.Map;

@Controller
@RequestMapping("/search")
public class SearchController extends AbstractController {

    @Autowired
    private SearchService searchService;
    @Autowired
    private DataService dataService;
    @Autowired
    private TagsParams tagsParams;
    @Autowired
    private SearchParams searchParams;

    @RequestMapping(method = RequestMethod.GET)
    public String index(Model model, final HttpServletRequest request, final RedirectAttributes ra) {
        return search(model, request, ra, null);
    }

    @RequestMapping(value = "/{indexType}", method = RequestMethod.GET)
    public String search(Model model, final HttpServletRequest request, final RedirectAttributes ra, @PathVariable("indexType") String indexType) {
        if (StringUtils.isBlank(indexType)) {
            indexType = "site";
        }
        SitesResponseDto result = searchService.search(indexType, false, searchParams, null);
        return processResults(model, request, indexType, "", result, true);
    }

    @RequestMapping(value = "/{indexType}/specials", method = RequestMethod.GET)
    public String specials(Model model, final HttpServletRequest request, final RedirectAttributes ra, @PathVariable("indexType") String indexType) {
        if (StringUtils.isBlank(indexType)) {
            indexType = "site";
        }
        SitesResponseDto result = searchService.special(indexType, false, searchParams, null);
        return processResults(model, request, indexType, "specials", result, false);
    }

    @RequestMapping(value = "/{indexType}/recent", method = RequestMethod.GET)
    public String recent(Model model, final HttpServletRequest request, final RedirectAttributes ra, @PathVariable("indexType") String indexType) {
        if (StringUtils.isBlank(indexType)) {
            indexType = "event";
        }
        SitesResponseDto result = searchService.recent(indexType, true, searchParams, 30);
        return processResults(model, request, indexType, "recent", result, false);
    }

    @RequestMapping(value = "/{indexType}/free", method = RequestMethod.GET)
    public String free(Model model, final HttpServletRequest request, final RedirectAttributes ra, @PathVariable("indexType") String indexType) {
        if (StringUtils.isBlank(indexType)) {
            indexType = "site";
        }
        SitesResponseDto result = searchService.free(indexType, false, searchParams, null);
        return processResults(model, request, indexType, "free", result, false);
    }

    @RequestMapping(value = "/{indexType}/around", method = RequestMethod.GET)
    public String around(Model model, final HttpServletRequest request, final RedirectAttributes ra, @PathVariable("indexType") String indexType) {
        if (StringUtils.isBlank(indexType)) {
            indexType = "site";
        }
        SitesResponseDto result = searchService.around(indexType, false, searchParams, null);
        return processResults(model, request, indexType, "around", result, false);
    }

    @RequestMapping(value = "/{indexType}/family", method = RequestMethod.GET)
    public String family(Model model, final HttpServletRequest request, final RedirectAttributes ra, @PathVariable("indexType") String indexType) {
        if (StringUtils.isBlank(indexType)) {
            indexType = "site";
        }
        SitesResponseDto result = searchService.family(indexType, false, searchParams, null);
        return processResults(model, request, indexType, "family", result, false);
    }

    private String processResults(Model model, HttpServletRequest request, String indexType, String category, SitesResponseDto result, boolean showTags) {
        if (result.getCount().getTotal() == 0) {
            return "redirect:/";
        }
        if (result.getTypeCounts().get(indexType) == 0) {
            for (Map.Entry<String, Integer> typeEntries : result.getTypeCounts().entrySet()) {
                if (typeEntries.getValue() != 0) {
                    return "redirect:/search/" + typeEntries.getKey();
                }
            }
        }

        Date searchDate = searchParams.getDateTime().toDate();
        Collections.sort(result.getSites(), new BaseSiteComparator(searchDate));

        model.addAttribute("indexType", indexType);
        model.addAttribute("category", category);
        model.addAttribute("sitesResponseDto", result);
        model.addAttribute("showTags", showTags);
        model.addAttribute("showDescription", false);
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

    @ModelAttribute("tags")
    public Map<String, Long> getTags() {
        return dataService.tags(searchParams);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "search";
    }

}
