package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.site.entity.WeatherInfos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/weather")
public class WeatherController extends AbstractController {

    @Autowired
    private WeatherInfos weatherInfos;

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET)
    public WeatherInfos get() {
        try {
            weatherInfos.updateIfNeeded();
            return new WeatherInfos(weatherInfos);
        } catch (Exception e) {
            return new WeatherInfos();
        }
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
