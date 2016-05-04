package fr.littlereddot.pocket.site.controller;

import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import fr.littlereddot.pocket.client.resource.ApplicationsResource;
import fr.littlereddot.pocket.client.resource.EventResource;
import fr.littlereddot.pocket.client.resource.HistoryResource;
import fr.littlereddot.pocket.client.resource.SiteResource;
import fr.littlereddot.pocket.client.resource.TicketsResource;
import fr.littlereddot.pocket.core.dto.search.StringSearchDto;
import fr.littlereddot.pocket.core.dto.search.TicketsSearchDto;
import fr.littlereddot.pocket.core.entity.Application;
import fr.littlereddot.pocket.core.entity.Event;
import fr.littlereddot.pocket.core.entity.History;
import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.core.entity.Vote;
import fr.littlereddot.pocket.core.entity.enums.ApplicationType;
import fr.littlereddot.pocket.site.entity.SearchParams;
import fr.littlereddot.pocket.site.service.VoteService;
import org.apache.commons.lang3.StringUtils;
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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/events/{id}/details/")
public class EventsDetailsController extends AbstractController {

    @Autowired
    private SiteResource siteResource;
    @Autowired
    private EventResource eventResource;
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
    public String details(final Model model, final HttpServletRequest request, final HttpServletResponse response, final Authentication principal, @PathVariable("id") String eventId) {
        final LocalDateTime dateTime = new LocalDateTime(searchParams.getDateTimeZone());
        Event event = eventResource.get(eventId);
        if (event == null) {
            return "redirect:/";
        }

        if (principal != null && principal.isAuthenticated()) {
            User activeUser = (User) principal.getPrincipal();
            historyResource.addEntry(activeUser.getId(), new History.Entry(dateTime, event));
        } else {
            ObjectId sessionId = getSessionId(request, response);
            historyResource.addEntry(sessionId, new History.Entry(dateTime, event));
        }
        model.addAttribute("event", event);
        model.addAttribute("site", siteResource.get(event.getSiteId().toString()));
        model.addAttribute("applications", createApplicationsMap(
                applicationsResource.findByEventId(event.getId()).getApplications()));
        TicketsSearchDto ticketsSearchDto = new TicketsSearchDto();
        ticketsSearchDto.setEventId(new StringSearchDto(event.getId().toString()));
        model.addAttribute("tickets", ticketsResource.search(ticketsSearchDto));

        String history = request.getParameter("history");
        navigationParam.updatePath(request, StringUtils.equals(history, "next") ? 3 : 2);
        return "eventsDetails";
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
    public Vote getVote(final Authentication principal, @PathVariable("id") final ObjectId eventId) {
        if (principal == null || !principal.isAuthenticated()) {
            return new Vote(null, "events", eventId, null);
        }
        User activeUser = (User) principal.getPrincipal();
        Vote vote = voteService.findBySubjectIdAndUserId(activeUser.getId(), eventId);
        if (vote == null) {
            return new Vote(activeUser.getId(), "events", eventId, null);
        }
        return vote;
    }

    @ModelAttribute("favorite")
    public Boolean getFavorite(final Authentication principal, @PathVariable("id") final ObjectId eventId) {
        if (principal == null || !principal.isAuthenticated()) {
            return false;
        }
        User activeUser = (User) principal.getPrincipal();
        return activeUser.getFavoritesIds().contains(eventId);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "eventDetails";
    }
}
