package fr.littlereddot.pocket.site.dto;

import java.util.List;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
public class WeatherDataResponse {
    private List<WeatherData> weather;
    private MainData main;

    public WeatherDataResponse() {
    }

    public List<WeatherData> getWeather() {
        return weather;
    }

    public void setWeather(List<WeatherData> weather) {
        this.weather = weather;
    }

    public MainData getMain() {
        return main;
    }

    public void setMain(MainData main) {
        this.main = main;
    }

}
