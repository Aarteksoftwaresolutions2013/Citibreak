package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.core.entity.Rating;
import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.site.service.VoteService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/{indexType}/vote")
public class VoteController extends AbstractController {

    @Autowired
    private VoteService voteService;

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public Rating save(final Authentication principal, @PathVariable("indexType") String indexType,
                       @RequestParam(value = "id") final ObjectId subjectId, @RequestParam final Integer rating) {
        if (principal == null || !principal.isAuthenticated()) {
            return new Rating();
        }
        User activeUser = (User) principal.getPrincipal();
        return voteService.save(activeUser.getId(), indexType, subjectId, rating);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
