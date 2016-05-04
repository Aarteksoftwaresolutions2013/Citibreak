package fr.littlereddot.pocket.site.dto;

import org.joda.time.LocalDate;

import java.util.List;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
public class WeatherForecast {
    private Long dt;
    private WeatherForecastTemp temp;
    private List<WeatherData> weather;

    public WeatherForecast() {
    }

    public Long getDt() {
        return dt;
    }

    public void setDt(Long dt) {
        this.dt = dt;
    }

    public WeatherForecastTemp getTemp() {
        return temp;
    }

    public void setTemp(WeatherForecastTemp temp) {
        this.temp = temp;
    }

    public List<WeatherData> getWeather() {
        return weather;
    }

    public void setWeather(List<WeatherData> weather) {
        this.weather = weather;
    }

    public LocalDate getLocalDate() {
        return new LocalDate(dt * 1000);
    }
}
