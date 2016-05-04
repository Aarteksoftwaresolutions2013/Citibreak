package fr.littlereddot.pocket.site.controller;

import com.google.appengine.repackaged.com.google.common.collect.Iterables;
import fr.littlereddot.pocket.client.resource.ArticlesResource;
import fr.littlereddot.pocket.core.dto.PointDto;
import fr.littlereddot.pocket.core.dto.response.ArticlesResponseDto;
import fr.littlereddot.pocket.core.dto.response.CountDto;
import fr.littlereddot.pocket.core.dto.response.SitesResponseDto;
import fr.littlereddot.pocket.core.dto.search.ArticlesSearchDto;
import fr.littlereddot.pocket.core.entity.Explore;
import fr.littlereddot.pocket.core.entity.SpecialEvent;
import fr.littlereddot.pocket.core.entity.enums.EditStatus;
import fr.littlereddot.pocket.core.search.CitySearch;
import fr.littlereddot.pocket.site.entity.SearchParams;
import fr.littlereddot.pocket.site.entity.TagsParams;
import fr.littlereddot.pocket.site.entity.TypesParams;
import fr.littlereddot.pocket.site.service.DataService;
import fr.littlereddot.pocket.site.service.ExploreService;
import fr.littlereddot.pocket.site.service.SearchService;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.LocalDate;
import org.joda.time.LocalTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/")
public class HomeController extends AbstractController {

    @Autowired
    private TypesParams typesParams;
    @Autowired
    private TagsParams tagsParams;
    @Autowired
    private SearchParams searchParams;
    @Autowired
    private DataService dataService;
    @Autowired
    private SearchService searchService;
    @Autowired
    private ArticlesResource articlesResource;
    @Autowired
    private ExploreService exploreService;

    @RequestMapping(method = RequestMethod.GET)
    public String index(Model model, HttpServletRequest request) {
        return index(model, request, "specials");
    }

    @RequestMapping(value = "home/{section}", method = RequestMethod.GET)
    public String index(Model model, final HttpServletRequest request, @PathVariable("section") final String section) {
        SpecialEvent currentSpecial = searchService.special(searchParams.getDateTime());
        model.addAttribute("section", section);
        model.addAttribute("hasSpecialEvent", currentSpecial != null);
        SitesResponseDto response;
        switch (section) {
            default:
            case "specials":
                if (currentSpecial != null) {
                    model.addAttribute("specialEvent", currentSpecial);
                    commonModelAttributes(model, request, null);
                } else {
                    return index(model, request, "newhomepage");
                }
                break;
            case "newhomepage":
                commonModelAttributes(model, request, null);
                break;
            case "buzz":
                commonModelAttributes(model, request, null);
            case "recent":
                response = searchService.recent("event", true, searchParams, 4);
                commonModelAttributes(model, request, response);
                break;
            case "free":
                response = searchService.free("site", true, searchParams, 4);
                commonModelAttributes(model, request, response);
                break;
            case "around":
                response = searchService.around("site", true, searchParams, 4);
                commonModelAttributes(model, request, response);
                break;
            case "family":
                response = searchService.family("site", true, searchParams, 4);
                commonModelAttributes(model, request, response);
                break;
        }
        return "home/" + section;
    }

    private void commonModelAttributes(Model model, HttpServletRequest request, SitesResponseDto response) {
        CountDto countDto;
        if (response != null && searchParams.getCity().isFilled()) {
            countDto = response.getCount();
            if (countDto.getTotal() == 0) {
                searchParams.getCity().generateDefaultCity(true, true);
            }
        } else {
            countDto = new CountDto();
        }
        searchParams.updateIfNeeded(dataService);
        ArticlesSearchDto articlesSearchDto = new ArticlesSearchDto();
        articlesSearchDto.setEditStatus(EditStatus.COMPLETE);
        ArticlesResponseDto articlesResponseDto = articlesResource.search(articlesSearchDto);
        model.addAttribute("searchParams", searchParams);
        model.addAttribute("articlesResponseDto", articlesResponseDto);
        model.addAttribute("sitesResponseDto", response);
        model.addAttribute("countDto", countDto);
        navigationParam.updatePath(request, 0);
    }

    @RequestMapping(value = "login", method = RequestMethod.GET)
    public String login(Model model, final HttpServletRequest request) {
        return index(model, request);
    }

    @RequestMapping(value = "date", method = RequestMethod.POST)
    public String date(@RequestParam("date") LocalDate date, final HttpServletRequest request, final RedirectAttributes ra) {
        searchParams.setDate(date);
        return "redirect:" + getPreviousPage(request);
    }

    @RequestMapping(value = "time", method = RequestMethod.POST)
    public String time(@RequestParam("time") LocalTime time, final HttpServletRequest request, final RedirectAttributes ra) {
        searchParams.setTime(time);
        return "redirect:" + getPreviousPage(request);
    }

    @RequestMapping(value = "city", method = RequestMethod.POST)
    public String location(CitySearch city, final HttpServletRequest request, final RedirectAttributes ra) {
        searchParams.setCity(city);
        searchParams.setNeedGeolocation(false);
        searchParams.generateTags(dataService);
        String previousPage = getPreviousPage(request);
        if (isHomePage(previousPage)) {
            return "redirect:/home/around/";
        }
        return "redirect:" + previousPage;
    }

    @RequestMapping(value = "geocoding", method = RequestMethod.POST)
    public String geocoding(PointDto pointDto, final HttpServletRequest request, final RedirectAttributes ra) {
        searchParams.updateGeolocData(dataService, pointDto);
        return "redirect:" + getPreviousPage(request);
    }

    @ModelAttribute("tags")
    public Map<String, Long> getTags() {
        return dataService.tags(searchParams);
    }

    @ModelAttribute("firstTags")
    public Map.Entry<String, Long> getFirstTags() {
        Map<String, Long> tags = dataService.tags(searchParams);
        Iterables.getFirst(tags.entrySet(), null);
        return Iterables.getFirst(tags.entrySet(), null);
    }

    @ModelAttribute("typesParams")
    public TypesParams getTypesParams() {
        return typesParams;
    }

    @ModelAttribute("tagsParams")
    public TagsParams getTagsParams() {
        return tagsParams;
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "home";
    }

    @ModelAttribute("exploreItems")
    public List<List<Explore>> getExploreItems() {
        return exploreService.getExploresAll();
    }

    private boolean isHomePage(String previousPage) {
        try {
            URL url = new URL(previousPage);
            return StringUtils.equals(url.getPath(), "/")
                    || StringUtils.equals(url.getPath(), "/home/buzz")
                    || StringUtils.equals(url.getPath(), "/home/buzz/");
        } catch (MalformedURLException e) {
            return false;
        }
    }
}
