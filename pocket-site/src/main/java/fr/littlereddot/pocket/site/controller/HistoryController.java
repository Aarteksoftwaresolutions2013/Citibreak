package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.client.resource.HistoryResource;
import fr.littlereddot.pocket.core.dto.response.ClearHistoryResponse;
import fr.littlereddot.pocket.core.entity.History;
import fr.littlereddot.pocket.core.entity.enums.HistoryEntryType;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/history")
public class HistoryController extends AbstractController {

    @Autowired
    private HistoryResource historyResource;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public History save(final HttpServletRequest request, final Authentication principal, @RequestParam final String sessionId) {
        ObjectId userId = getAnyUserId(request, principal, sessionId);
        if (userId == null) {
            return new History();
        }
        return historyResource.getByUser(userId);
    }

    @ResponseBody
    @RequestMapping(value = "/clearAll", method = RequestMethod.POST)
    public ClearHistoryResponse clearAll(final HttpServletRequest request, final Authentication principal, @RequestParam final String sessionId) {
        ObjectId userId = getAnyUserId(request, principal, sessionId);
        if (userId != null) {
            historyResource.clearByUser(userId);
        }
        return new ClearHistoryResponse();
    }


    @ResponseBody
    @RequestMapping(value = "/clear", method = RequestMethod.POST)
    public ClearHistoryResponse clear(final HttpServletRequest request, final Authentication principal, final HistoryEntryType type, @RequestParam final String sessionId) {
        ObjectId userId = getAnyUserId(request, principal, sessionId);
        if (userId != null) {
            historyResource.clearByType(userId, type);
        }
        return new ClearHistoryResponse();
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
