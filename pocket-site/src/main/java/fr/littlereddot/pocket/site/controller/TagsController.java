package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.site.dto.TagsForm;
import fr.littlereddot.pocket.site.entity.SearchParams;
import fr.littlereddot.pocket.site.entity.TagsParams;
import fr.littlereddot.pocket.site.service.DataService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping("/tags")
public class TagsController extends AbstractController {

    @Autowired
    private SearchParams searchParams;
    @Autowired
    private TagsParams tagsParams;
    @Autowired
    private DataService dataService;

    @RequestMapping(method = RequestMethod.GET)
    public String tags(final HttpServletRequest request) {
        navigationParam.updatePath(request, 1);
        return "tags";
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public String delete(String tag, final RedirectAttributes ra) {
        searchParams.getTags().remove(tag);
        return "redirect:/assistant";
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public String update(TagsForm tagsForm, final HttpServletRequest request, final RedirectAttributes ra) {
        searchParams.setTags(tagsForm.getTags());
        if (StringUtils.equals(request.getParameter("source"), "back")) {
            return "redirect:/assistant";
        } else {
            return "redirect:/search/site";
        }
    }

    @ModelAttribute("tags")
    public Map<String, Long> getTags() {
        return dataService.tags(searchParams);
    }

    @ModelAttribute("searchParams")
    public SearchParams getSearchParams() {
        return searchParams;
    }

    @ModelAttribute("tagsParams")
    public TagsParams getTagsParams() {
        return tagsParams;
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "tags";
    }
}
