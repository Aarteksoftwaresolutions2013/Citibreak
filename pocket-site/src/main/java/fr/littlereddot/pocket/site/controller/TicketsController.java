package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.core.dto.PointDto;
import fr.littlereddot.pocket.core.dto.response.TicketsResponseDto;
import fr.littlereddot.pocket.site.entity.CountryParam;
import fr.littlereddot.pocket.site.entity.SearchParams;
import fr.littlereddot.pocket.site.service.TicketsService;
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
@RequestMapping("/tickets")
public class TicketsController extends AbstractController {

    @Autowired
    private TicketsService ticketsService;
    @Autowired
    private CountryParam countryParam;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public TicketsResponseDto get(@RequestParam("lat") Double lat, @RequestParam("lng") Double lng) {
        return ticketsService.find(new PointDto(lat, lng), countryParam.getLocale());
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
