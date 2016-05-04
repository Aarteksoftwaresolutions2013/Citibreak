package fr.littlereddot.pocket.site.controller;

import com.google.appengine.repackaged.com.google.common.collect.Iterables;
import fr.littlereddot.pocket.client.resource.SiteResource;
import fr.littlereddot.pocket.core.dto.response.FavoriteResultDto;
import fr.littlereddot.pocket.core.dto.response.FavoritesResponseDto;
import fr.littlereddot.pocket.core.entity.DayOut;
import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.site.entity.SearchParams;
import fr.littlereddot.pocket.site.service.FavoriteService;
import org.apache.commons.lang.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;

@Controller
public class FavoriteController extends AbstractController {

    @Autowired
    private FavoriteService favoriteService;
    @Autowired
    private SiteResource siteResource;
    @Autowired
    private SearchParams searchParams;

    @RequestMapping(value = "/favorites", method = RequestMethod.GET)
    public String index(Model model, Authentication principal, final HttpServletRequest request, final RedirectAttributes ra) {
        return favorites(model, principal, request, ra, null, null);
    }

    @RequestMapping(value = "/favorites/{indexType}", method = RequestMethod.GET)
    public String favorites(final Model model, final Authentication principal, final HttpServletRequest request, final RedirectAttributes ra,
                            @PathVariable("indexType") String indexType, @RequestParam(value = "tag", required = false) final String dayOutId) {
        if (principal == null || !principal.isAuthenticated()) {
            return "redirect:/";
        }
        User activeUser = (User) principal.getPrincipal();
        FavoritesResponseDto favorites = favoriteService.getByUser(activeUser);
        if (favorites.getSites().isEmpty() && favorites.getEvents().isEmpty() && favorites.getDaysOut().isEmpty()) {
            return "redirect:/";
        }
        if (indexType == null) {
            indexType = "site";
        }

        if (StringUtils.equals("site", indexType) && favorites.getSites().isEmpty()) {
            if (favorites.getDaysOut().isEmpty()) {
                indexType = "event";
            } else {
                indexType = "dayOut";
            }
        } else if (StringUtils.equals("event", indexType) && favorites.getEvents().isEmpty()) {
            if (favorites.getDaysOut().isEmpty()) {
                indexType = "site";
            } else {
                indexType = "dayOut";
            }
        }
        String firstDayOutId = StringUtils.equals("dayOut", indexType) ? getFirstDayOut(dayOutId, favorites) : dayOutId;

        model.addAttribute("favoritesResponseDto", favorites);
        model.addAttribute("indexType", indexType);
        model.addAttribute("tag", firstDayOutId);
        navigationParam.updatePath(request, 0);
        return "favorites";
    }

    private String getFirstDayOut(String currentDayOut, FavoritesResponseDto favorites) {
        if (StringUtils.isBlank(currentDayOut)) {
            DayOut first = Iterables.getFirst(favorites.getDaysOut(), null);
            if (first != null) {
                return first.getId().toString();
            }
        }
        return currentDayOut;
    }

    @ResponseBody
    @RequestMapping(value = "/subjects/favorites", method = RequestMethod.POST)
    public FavoriteResultDto save(final Authentication principal, @RequestParam(value = "id") final ObjectId subjectId, @RequestParam(value = "favorite") final boolean favorite) {
        if (principal == null || !principal.isAuthenticated()) {
            return new FavoriteResultDto();
        }
        User activeUser = (User) principal.getPrincipal();
        return favoriteService.save(activeUser, subjectId, favorite);
    }

    @ModelAttribute("searchParams")
    public SearchParams getSearchParams() {
        return searchParams;
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "favorite";
    }
}
