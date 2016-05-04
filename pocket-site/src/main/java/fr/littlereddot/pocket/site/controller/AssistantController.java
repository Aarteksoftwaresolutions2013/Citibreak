package fr.littlereddot.pocket.site.controller;

import com.google.common.collect.Lists;
import fr.littlereddot.pocket.core.dto.response.CountDto;
import fr.littlereddot.pocket.site.entity.SearchParams;
import fr.littlereddot.pocket.site.entity.TagsParams;
import fr.littlereddot.pocket.site.entity.TypesParams;
import fr.littlereddot.pocket.site.service.DataService;
import fr.littlereddot.pocket.site.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequestMapping("/assistant")
public class AssistantController extends AbstractController {

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

    private CountDto countDto;
    private List<String> types;

    @RequestMapping(method = RequestMethod.GET)
    public String index(Model model, final HttpServletRequest request) {
        if (searchParams.getCity().isFilled()) {
            countDto = searchService.search(null, true, searchParams, null).getCount();
            if (countDto.getTotal() == 0) {
                searchParams.getCity().generateDefaultCity(true, true);
            }
            types = dataService.types(searchParams);
        } else {
            countDto = new CountDto();
            types = Lists.newArrayList();
        }
        searchParams.updateIfNeeded(dataService);
        model.addAttribute("searchParams", searchParams);
        model.addAttribute("countDto", countDto);
        model.addAttribute("types", types);
        navigationParam.updatePath(request, 0);
        return "assistant";
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
        return "assistant";
    }
}
