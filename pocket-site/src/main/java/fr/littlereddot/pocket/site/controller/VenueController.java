
package fr.littlereddot.pocket.site.controller;

import com.google.appengine.repackaged.com.google.common.base.Objects;
import fr.littlereddot.pocket.client.resource.HistoryResource;
import fr.littlereddot.pocket.client.resource.SiteResource;
import fr.littlereddot.pocket.core.entity.History;
import fr.littlereddot.pocket.core.entity.Site;
import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.site.dto.yelp.VenueData;
import fr.littlereddot.pocket.site.dto.yelp.VenueType;
import fr.littlereddot.pocket.site.dto.yelp.Venues;
import fr.littlereddot.pocket.site.entity.SearchParams;
import fr.littlereddot.pocket.site.service.FoursquareService;
import org.bson.types.ObjectId;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.geo.Point;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
@Controller
@RequestMapping("/venue")
public class VenueController extends AbstractController {

    private static final int SEARCH_RADIUS = 2000;

    @Autowired
    private FoursquareService foursquareService;
    @Autowired
    private SiteResource siteResource;
    @Autowired
    private HistoryResource historyResource;
    @Autowired
    private SearchParams searchParams;

    @ResponseBody
    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public Venues search(@RequestParam(value = "siteId", required = true) final String siteId,
                         @RequestParam(value = "venueType", required = true) final VenueType venueType) {
        Site site = siteResource.get(siteId);
        return Venues.of(foursquareService.findVenues(
                venueType,
                site.getLocation(),
                SEARCH_RADIUS,
                LocaleContextHolder.getLocale().getLanguage()));
    }

    @RequestMapping(value = "/{venueType}/{id}/details", method = RequestMethod.GET)
    public String details(final Model model, final HttpServletRequest request, final HttpServletResponse response, final Authentication principal,
                          @PathVariable("venueType") VenueType venueType, @PathVariable("id") String venueId,
                          @RequestParam(value = "siteId", required = false) final String siteId) {
        Point location = null;
        if (siteId != null) {
            Site site = siteResource.get(siteId);
            location = site == null ? null : site.getLocation();
        }
        final LocalDateTime dateTime = new LocalDateTime(searchParams.getDateTimeZone());
        VenueData venue = foursquareService.getVenue(venueId, venueType, LocaleContextHolder.getLocale().getLanguage());
        History.Entry historyEntry = new History.Entry(
                dateTime,
                new ObjectId(venue.getId()),
                venue.getName(),
                Objects.firstNonNull(venue.getImageUrl(), getDefaultImageForCategory(venueType)),
                "venue/" + venueType.name(),
                venueType.getHistoryEntryType(),
                venue.getFormattedAddress());
        if (principal != null && principal.isAuthenticated()) {
            User activeUser = (User) principal.getPrincipal();
            historyResource.addEntry(activeUser.getId(), historyEntry);
        } else {
            ObjectId sessionId = getSessionId(request, response);
            historyResource.addEntry(sessionId, historyEntry);
        }

        model.addAttribute("venue", venue);
        model.addAttribute("venueType", venueType);
        model.addAttribute("siteLocation", location);
        navigationParam.updatePath(request, 3);
        return "venueDetails";
    }

    private String getDefaultImageForCategory(VenueType venueType) {
        return "/img/" + venueType.name().toLowerCase() + ".jpg";
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "venueDetails";
    }

}
