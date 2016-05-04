package fr.littlereddot.pocket.site.entity;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import fr.littlereddot.pocket.core.dto.PointDto;
import fr.littlereddot.pocket.core.search.CitySearch;
import fr.littlereddot.pocket.site.service.DataService;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.Interval;
import org.joda.time.LocalDate;
import org.joda.time.LocalTime;
import org.joda.time.Minutes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import org.thymeleaf.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.Set;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SearchParams {
    private static final Map<String, DateTimeZone> TIME_ZONES = Maps.newHashMap();
    static {
        TIME_ZONES.put("fr", DateTimeZone.forID("Europe/Paris"));
        TIME_ZONES.put("france", DateTimeZone.forID("Europe/Paris"));
        TIME_ZONES.put("gp", DateTimeZone.forID("America/Guadeloupe"));
        TIME_ZONES.put("guadeloupe", DateTimeZone.forID("America/Guadeloupe"));
        TIME_ZONES.put("mq", DateTimeZone.forID("America/Martinique"));
        TIME_ZONES.put("martinique", DateTimeZone.forID("America/Martinique"));
        TIME_ZONES.put("re", DateTimeZone.forID("Indian/Reunion"));
        TIME_ZONES.put("réunion", DateTimeZone.forID("Indian/Reunion"));
        TIME_ZONES.put("reunion", DateTimeZone.forID("Indian/Reunion"));
        TIME_ZONES.put("gf", DateTimeZone.forID("America/Guyana"));
        TIME_ZONES.put("guyane", DateTimeZone.forID("America/Guyana"));
        TIME_ZONES.put("guyane francaise", DateTimeZone.forID("America/Guyana"));
        TIME_ZONES.put("pf", DateTimeZone.forID("Pacific/Tahiti"));
        TIME_ZONES.put("tahiti", DateTimeZone.forID("Pacific/Tahiti"));
        TIME_ZONES.put("pf", DateTimeZone.forID("Pacific/Tahiti"));
        TIME_ZONES.put("nouvelle caledonie", DateTimeZone.forID("Pacific/Tahiti"));
        TIME_ZONES.put("nc", DateTimeZone.forID("Pacific/Noumea"));
        TIME_ZONES.put("new caledonia", DateTimeZone.forID("Pacific/Noumea"));
        TIME_ZONES.put("pm", DateTimeZone.forID("America/Miquelon"));
        TIME_ZONES.put("saint-pierre-et-miquelon", DateTimeZone.forID("America/Miquelon"));
    }

    private LocalDate date;
    private LocalTime time;
    private CitySearch city;
    private Set<String> tags = Sets.newHashSet();
    private DateTimeZone dateTimeZone;
    private boolean needGeolocation;
    private DateTime lastUpdate;
    private DateTime lastGeolocationUpdate;

    @Autowired
    public SearchParams(final DataService dataService, HttpServletRequest request) {
        generateCity(dataService, request);
        generateNewDate();
        generateTags(dataService);
    }

    public void generateTags(DataService dataService) {
        final Random random = new Random();
        final List<String> tags = Lists.newArrayList(dataService.tags(this).keySet());
        cleanOldTags(tags);
        if (!tags.isEmpty()) {
            final Integer tagsCount = tags.size();
            while (this.tags.size() < 1) {
                this.tags.add(tags.get(random.nextInt(tagsCount)));
                if (tags.size() < 1) {
                    break;
                }
            }
        } else {
            this.tags = Sets.newHashSet();
        }
    }

    private void cleanOldTags(List<String> tags) {
        final Iterator<String> iterator = this.tags.iterator();
        while (iterator.hasNext()) {
            if (!tags.contains(iterator.next())) {
                iterator.remove();
            }
        }
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public CitySearch getCity() {
        return city;
    }

    public void setCity(CitySearch city) {
        this.city = city;
    }

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
        this.tags = tags;
    }

    public DateTimeZone getDateTimeZone() {
        return dateTimeZone;
    }

    public void setDateTimeZone(DateTimeZone dateTimeZone) {
        this.dateTimeZone = dateTimeZone;
    }

    public boolean isNeedGeolocation() {
        return needGeolocation;
    }

    public void setNeedGeolocation(boolean needGeolocation) {
        this.needGeolocation = needGeolocation;
    }

    public DateTime getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(DateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    public DateTime getLastGeolocationUpdate() {
        return lastGeolocationUpdate;
    }

    public void setLastGeolocationUpdate(DateTime lastGeolocationUpdate) {
        this.lastGeolocationUpdate = lastGeolocationUpdate;
    }

    public DateTime getDateTime() {
        return date.toDateTime(time);
    }

    public Integer getTimeAsMinutes() {
        return Minutes.minutesBetween(LocalTime.MIDNIGHT, time).getMinutes();
    }

    public void updateIfNeeded(DataService dataService) {
        Minutes timesToRefresh = Minutes.minutes(15);
        Minutes elapsedMinutes = new Interval(lastUpdate, new DateTime(dateTimeZone)).toDuration().toStandardMinutes();
        if (elapsedMinutes.isGreaterThan(timesToRefresh)) {
            generateNewDate();
        }
        Minutes geolocationElapsedMinutes = new Interval(lastGeolocationUpdate, new DateTime(dateTimeZone)).toDuration().toStandardMinutes();
        if (geolocationElapsedMinutes.isGreaterThan(timesToRefresh)) {
            this.needGeolocation = true;
            this.lastGeolocationUpdate = new DateTime(dateTimeZone);
            generateTags(dataService);
        }
    }

    private void generateCity(DataService dataService, HttpServletRequest request) {
        final String ipAddress = request.getRemoteAddr();
        this.city = dataService.getCityFromIp(ipAddress);
        final String lowerCountry = StringUtils.toLowerCase(city.getCountry(), Locale.getDefault());
        this.dateTimeZone = TIME_ZONES.containsKey(lowerCountry) ? TIME_ZONES.get(lowerCountry) : DateTimeZone.UTC;
        this.needGeolocation = this.city.isCovered();
        this.lastGeolocationUpdate = new DateTime(dateTimeZone);
    }

    private void generateNewDate() {
        final DateTime now = new DateTime(dateTimeZone);
        this.date = now.toLocalDate();
        this.time = now.toLocalTime();
        this.lastUpdate = now;
    }

    public void updateGeolocData(DataService dataService, PointDto pointDto) {
        this.needGeolocation = false;
        this.lastGeolocationUpdate = new DateTime(dateTimeZone);
        this.city = dataService.getCityFromPoint(pointDto);
        generateTags(dataService);
    }
}
