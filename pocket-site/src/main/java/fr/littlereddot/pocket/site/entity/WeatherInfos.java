package fr.littlereddot.pocket.site.entity;

import com.google.common.collect.Maps;
import fr.littlereddot.pocket.site.dto.WeatherData;
import fr.littlereddot.pocket.site.dto.WeatherForecast;
import fr.littlereddot.pocket.site.dto.WeatherForecastResponse;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.joda.time.Days;
import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class WeatherInfos {
  //  private static final String UPDATE_URL = "http://api.openweathermap.org/data/2.5/forecast/daily?q={city},{country}&lang={language}&cnt=16&mode=json&units=metric&APPID=46b05fafee3464cf50e4e71b1852dfbb";
	 private static final String UPDATE_URL = "http://api.openweathermap.org/data/2.5/forecast/daily?q={city},{country}&lang={language}&cnt=16&mode=json&units=metric&APPID=46b05fafee3464cf50e4e71b1852dfbb";
    @Autowired
    private transient RestTemplate restTemplate;
    @Autowired
    private transient SearchParams searchParams;
    @Autowired
    private transient CountryParam countryParam;

    private LocalDate date;
    private String city;
    private Integer temperature;
    private String description;
    private String icon;
    private Boolean validResponse;
    private LocalDate lastUpdate;
    private String language;
    private WeatherForecastResponse response;

    public WeatherInfos() {
        this.date = null;
        this.city = null;
        this.temperature = null;
        this.description = null;
        this.validResponse = false;
    }

    public WeatherInfos(WeatherInfos weatherInfos) {
        this.date = weatherInfos.getDate();
        this.city = weatherInfos.getCity();
        this.temperature = weatherInfos.getTemperature();
        this.description = weatherInfos.getDescription();
        this.icon = weatherInfos.getIcon();
        this.validResponse = weatherInfos.getValidResponse();
        this.lastUpdate = weatherInfos.getLastUpdate();
    }

    public LocalDate getDate() {
        return date;
    }

    public String getCity() {
        return city;
    }

    public Integer getTemperature() {
        return temperature;
    }

    public String getDescription() {
        return description;
    }

    public String getIcon() {
        return icon;
    }

    public Boolean getValidResponse() {
        return validResponse;
    }

    public LocalDate getLastUpdate() {
        return lastUpdate;
    }

    public String getLanguage() {
        return language;
    }

    public void updateIfNeeded() {
        this.validResponse = true;

        if (!searchParams.getCity().isFilled()) {
            invalidate(false);
            return;
        }

        final LocalDate now = new DateTime(searchParams.getDateTimeZone()).toLocalDate();
        if (lastUpdate != null
                && Days.daysBetween(now, searchParams.getDate()).isGreaterThan(Days.days(16))) {
            invalidate(true);
            return;
        }

        if (lastUpdate != null && date != null
                && Days.daysBetween(searchParams.getDate(), date).equals(Days.ZERO)
                && StringUtils.equalsIgnoreCase(searchParams.getCity().getName(), city)
                && StringUtils.equalsIgnoreCase(countryParam.getLanguage(), language)) {
            return;
        }

        // Reset response if too old
        if (lastUpdate != null
                && (Days.daysBetween(lastUpdate, now).isGreaterThan(Days.ONE)
                || !StringUtils.equalsIgnoreCase(searchParams.getCity().getName(), city)
                || !StringUtils.equalsIgnoreCase(countryParam.getLanguage(), language))) {
            response = null;
        }

        if (response == null) {
            Map<String, String> params = Maps.newHashMap();
            params.put("city", searchParams.getCity().getName());
            params.put("country", searchParams.getCity().getCountry());
            params.put("language", countryParam.getLanguage());
            response = restTemplate.getForObject(UPDATE_URL, WeatherForecastResponse.class, params);
            if (!StringUtils.equals(response.getCod(), "200") || response.getList().isEmpty()) {
                invalidate(false);
                return;
            }
        }

        WeatherForecast weatherForecast = null;
        for (WeatherForecast forecast : response.getList()) {
            LocalDate weatherDate = forecast.getLocalDate();
            if (Days.daysBetween(weatherDate, searchParams.getDate()).equals(Days.ZERO)) {
                weatherForecast = forecast;
                break;
            }
        }
        if (weatherForecast == null) {
            invalidate(false);
            return;
        }

        WeatherData weatherData = weatherForecast.getWeather().get(0);

        city = searchParams.getCity().getName();
        date = searchParams.getDate();
        temperature = Long.valueOf(Math.round(weatherForecast.getTemp().getDay())).intValue();
        description = weatherData.getDescription();
        icon = weatherData.getIcon();
        lastUpdate = new DateTime(searchParams.getDateTimeZone()).toLocalDate();
        language = countryParam.getLanguage();
    }

    private void invalidate(boolean keepData) {
        if (!keepData) {
            date = null;
            city = null;
            temperature = null;
            description = null;
            icon = null;
        }
        validResponse = false;
        lastUpdate = new DateTime(searchParams.getDateTimeZone()).toLocalDate();
    }
}
