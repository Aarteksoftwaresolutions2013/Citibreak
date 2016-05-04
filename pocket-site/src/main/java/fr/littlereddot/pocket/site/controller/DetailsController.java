package fr.littlereddot.pocket.site.controller;

import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import fr.littlereddot.pocket.client.resource.ApplicationsResource;
import fr.littlereddot.pocket.client.resource.EventsResource;
import fr.littlereddot.pocket.client.resource.HistoryResource;
import fr.littlereddot.pocket.client.resource.SiteResource;
import fr.littlereddot.pocket.client.resource.TicketsResource;
import fr.littlereddot.pocket.core.dto.search.StringSearchDto;
import fr.littlereddot.pocket.core.dto.search.TicketsSearchDto;
import fr.littlereddot.pocket.core.entity.Application;
import fr.littlereddot.pocket.core.entity.Event;
import fr.littlereddot.pocket.core.entity.History;
import fr.littlereddot.pocket.core.entity.Site;
import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.core.entity.Vote;
import fr.littlereddot.pocket.core.entity.enums.ApplicationType;
import fr.littlereddot.pocket.site.entity.SearchParams;
import fr.littlereddot.pocket.site.service.VoteService;
import org.bson.types.ObjectId;
import org.joda.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/sites/{id}/details/")
public class DetailsController extends AbstractController {

    @Autowired
    private SiteResource siteResource;
    @Autowired
    private EventsResource eventsResource;
    @Autowired
    private ApplicationsResource applicationsResource;
    @Autowired
    private HistoryResource historyResource;
    @Autowired
    private TicketsResource ticketsResource;
    @Autowired
    private SearchParams searchParams;
    @Autowired
    private VoteService voteService;

    @RequestMapping(method = RequestMethod.GET)
    public String details(final Model model, final HttpServletRequest request, final HttpServletResponse response, final Authentication principal, @PathVariable("id") String siteId) {
        final LocalDateTime dateTime = new LocalDateTime(searchParams.getDateTimeZone());
        Site site = siteResource.get(siteId);
        if (site == null) {
            return "redirect:/";
        }

        if (principal != null && principal.isAuthenticated()) {
            User activeUser = (User) principal.getPrincipal();
            historyResource.addEntry(activeUser.getId(), new History.Entry(dateTime, site));
        } else {
            ObjectId sessionId = getSessionId(request, response);
            historyResource.addEntry(sessionId, new History.Entry(dateTime, site));
        }
        model.addAttribute("site", site);
        List<Event> events = eventsResource.findBySiteId(site.getId()).getEvents();
        model.addAttribute("events", Lists.newArrayList(Iterables.filter(events, new Predicate<Event>() {
            @Override
            public boolean apply(Event event) {
                return event.isOpenAfterDate(dateTime.toDate());
            }
        })));
        model.addAttribute("applications", createApplicationsMap(
                applicationsResource.findBySiteId(site.getId()).getApplications()));
        TicketsSearchDto ticketsSearchDto = new TicketsSearchDto();
        ticketsSearchDto.setSiteId(new StringSearchDto(site.getId().toString()));
        model.addAttribute("tickets", ticketsResource.search(ticketsSearchDto));

        navigationParam.updatePath(request, 2);
        return "details";
    }

    private Map<String, List<Application>> createApplicationsMap(List<Application> applications) {
        Map<String, List<Application>> applicationsMap = Maps.newHashMap();
        for (final ApplicationType type : ApplicationType.values()) {
            List<Application> filteredApplications = Lists.newArrayList(Iterables.filter(applications, new Predicate<Application>() {
                @Override
                public boolean apply(Application application) {
                    return type == application.getType();
                }
            }));
            if (!filteredApplications.isEmpty()) {
                applicationsMap.put(type.name(), filteredApplications);
            }
        }
        return applicationsMap;
    }

    @ModelAttribute("searchParams")
    private SearchParams getSearchParams() {
        return searchParams;
    }

    @ModelAttribute("vote")
    public Vote getVote(final Authentication principal, @PathVariable("id") final ObjectId siteId) {
        if (principal == null || !principal.isAuthenticated()) {
            return new Vote(null, "sites", siteId, null);
        }
        User activeUser = (User) principal.getPrincipal();
        Vote vote = voteService.findBySubjectIdAndUserId(activeUser.getId(), siteId);
        if (vote == null) {
            return new Vote(activeUser.getId(), "sites", siteId, null);
        }
        return vote;
    }

    @ModelAttribute("favorite")
    public Boolean getFavorite(final Authentication principal, @PathVariable("id") final ObjectId siteId) {
        if (principal == null || !principal.isAuthenticated()) {
            return false;
        }
        User activeUser = (User) principal.getPrincipal();
        return activeUser.getFavoritesIds().contains(siteId);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "details";
    }
}
