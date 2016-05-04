package fr.littlereddot.pocket.site.dto;

import java.util.List;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
public class WeatherForecastResponse {
    private String cod;
    private List<WeatherForecast> list;

    public WeatherForecastResponse() {
    }

    public String getCod() {
        return cod;
    }

    public void setCod(String cod) {
        this.cod = cod;
    }

    public List<WeatherForecast> getList() {
        return list;
    }

    public void setList(List<WeatherForecast> list) {
        this.list = list;
    }
}
