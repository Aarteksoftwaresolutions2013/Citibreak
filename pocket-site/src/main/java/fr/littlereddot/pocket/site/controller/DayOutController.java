package fr.littlereddot.pocket.site.controller;

import com.google.appengine.repackaged.com.google.common.base.Function;
import com.google.appengine.repackaged.com.google.common.collect.Lists;
import fr.littlereddot.pocket.client.resource.DayOutResource;
import fr.littlereddot.pocket.core.dto.request.DayOutDto;
import fr.littlereddot.pocket.core.dto.request.DayOutEntryDto;
import fr.littlereddot.pocket.core.dto.response.AddDayOutResponse;
import fr.littlereddot.pocket.core.dto.response.DayOutResponseDto;
import fr.littlereddot.pocket.core.entity.DayOut;
import fr.littlereddot.pocket.core.entity.History;
import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.site.service.UrlShortener;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.servlet.http.HttpServletRequest;
import java.text.MessageFormat;
import java.util.Date;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
@Controller
@RequestMapping("/dayout")
public class DayOutController extends AbstractController {

    @Autowired
    private DayOutResource dayOutResource;
    @Autowired
    private UrlShortener urlShortener;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public DayOutResponseDto get(final Authentication principal) {
        if (principal == null || !principal.isAuthenticated()) {
            return new DayOutResponseDto();
        }
        return dayOutResource.getByUser(((User) principal.getPrincipal()).getId());
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public AddDayOutResponse save(final HttpServletRequest request, final Authentication principal, final DayOutDto dayOutDto, @RequestParam(required = false) final String sessionId) {
        ObjectId userId = getAnyUserId(request, principal, sessionId);
        DayOut dayOut = new DayOut();
        dayOut.setCreated(new Date());
        dayOut.setName(dayOutDto.getName());
        dayOut.setUserId(userId);
        if (dayOutDto.getEntries() != null) {
            dayOut.setEntries(Lists.transform(dayOutDto.getEntries(), new Function<DayOutEntryDto, History.Entry>() {
                @Override
                public History.Entry apply(DayOutEntryDto dayOutEntryDto) {
                    return new History.Entry(null,
                            new ObjectId(dayOutEntryDto.getSubjectId()),
                            dayOutEntryDto.getName(),
                            dayOutEntryDto.getDisplayImageUrl(),
                            dayOutEntryDto.getBasePath(),
                            dayOutEntryDto.getType(),
                            dayOutEntryDto.getAddress());
                }
            }));
        }
        AddDayOutResponse response = dayOutResource.save(userId, dayOut);
        String longUrl = constructAgendaUrl(request.getServerName(), response.getUuid());
        response.setLongUrl(longUrl);
        try {
            response.setShortUrl(urlShortener.shorten(longUrl));
        } catch (Exception e) {
            response.setShortUrl(longUrl);
            response.setUrlShortenerError(MessageFormat.format("Url shortener caused an error: {0} {1} {2}", e.getClass().getName().toLowerCase(), e.getCause(), e.getMessage()));
        }
        return response;
    }

    private String constructAgendaUrl(String serverName, String uuid) {
        return "http://" + serverName + "/agenda/" + uuid;
    }

    @ResponseBody
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public boolean delete(final Authentication principal, @RequestParam(value = "id") final ObjectId subjectId) {
        if (principal == null || !principal.isAuthenticated()) {
            return false;
        }
        User activeUser = (User) principal.getPrincipal();
        return dayOutResource.delete(activeUser.getId(), subjectId);
    }


    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }

}
