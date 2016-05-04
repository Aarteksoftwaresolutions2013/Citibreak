package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.client.resource.CommentsResource;
import fr.littlereddot.pocket.core.dto.response.AddCommentsResponse;
import fr.littlereddot.pocket.core.entity.Comments;
import fr.littlereddot.pocket.core.entity.User;
import fr.littlereddot.pocket.site.entity.CountryParam;
import fr.littlereddot.pocket.site.entity.SearchParams;
import org.bson.types.ObjectId;
import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.thymeleaf.util.StringUtils;

@Controller
@RequestMapping("/subjects/comments")
public class CommentsController extends AbstractController {

    @Autowired
    private SearchParams searchParams;
    @Autowired
    private CommentsResource commentsResource;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public Comments get(@RequestParam(value = "id") final ObjectId subjectId) {
        return commentsResource.getBySubject(subjectId);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public AddCommentsResponse save(final Authentication principal, @RequestParam(value = "id") final ObjectId subjectId, @RequestParam(value = "text") final String text) {
        if (principal == null || !principal.isAuthenticated()) {
            return new AddCommentsResponse();
        }
        User activeUser = (User) principal.getPrincipal();
        Comments.Comment comment = new Comments.Comment();
        comment.setId(new ObjectId());
        comment.setText(StringUtils.substring(text, 0, Math.min(text.length(), 260)));
        comment.setDate(new LocalDate(searchParams.getDateTimeZone()).toDate());
        comment.setName(activeUser.getName());
        comment.setImageUrl(activeUser.getAvatarUrl());
        return commentsResource.save(subjectId, comment);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
