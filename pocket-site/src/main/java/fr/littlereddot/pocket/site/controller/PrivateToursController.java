package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.client.resource.PrivateToursResource;
import fr.littlereddot.pocket.core.dto.response.PrivateToursResponseDto;
import fr.littlereddot.pocket.core.dto.search.PrivateToursSearchDto;
import fr.littlereddot.pocket.core.dto.search.StringSearchDto;
import fr.littlereddot.pocket.site.entity.CountryParam;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 */
@Controller
@RequestMapping("/privateTours")
public class PrivateToursController extends AbstractController {

    @Autowired
    private PrivateToursResource ticketsResource;

    @ResponseBody
    @RequestMapping(value = "/site", method = RequestMethod.GET)
    public PrivateToursResponseDto getSite(@RequestParam("siteId") ObjectId siteId) {
        PrivateToursSearchDto privateToursSearchDto = new PrivateToursSearchDto();
        privateToursSearchDto.setSiteId(new StringSearchDto(siteId.toString()));
        return ticketsResource.search(privateToursSearchDto);
    }

    @ResponseBody
    @RequestMapping(value = "/event", method = RequestMethod.GET)
    public PrivateToursResponseDto getEvent(@RequestParam("eventId") ObjectId eventId) {
        PrivateToursSearchDto privateToursSearchDto = new PrivateToursSearchDto();
        privateToursSearchDto.setEventId(new StringSearchDto(eventId.toString()));
        return ticketsResource.search(privateToursSearchDto);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
