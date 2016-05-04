package fr.littlereddot.pocket.site.service;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import fr.littlereddot.pocket.client.resource.SearchResource;
import fr.littlereddot.pocket.core.dto.PointDto;
import fr.littlereddot.pocket.core.dto.search.ParamsSearchDto;
import fr.littlereddot.pocket.core.search.CitySearch;
import fr.littlereddot.pocket.site.dto.ipaddresslabs.IpAddressLabsResponse;
import fr.littlereddot.pocket.site.dto.mapquest.MapQuestReverseResponse;
import fr.littlereddot.pocket.site.entity.SearchParams;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Service
public class DataService {

    private static final Logger LOGGER = LoggerFactory.getLogger(DataService.class);
    private static final Map<String, String> countryCodes = Maps.newHashMap();
    static {
        countryCodes.put("fr", "France");
        countryCodes.put("gp", "Guadeloupe");
        countryCodes.put("mq", "Martinique");
        countryCodes.put("re", "Réunion");
        countryCodes.put("gf", "Guyane");
        countryCodes.put("pf", "Polynésie");
        countryCodes.put("nc", "Nouvelle-Calédonie");
        countryCodes.put("pm", "Saint Pierre et Miquelon");
    }
    @Value("${api.ipaddresslabs.key}")
    private String ipAddressLabsKey;
    @Value("${api.ipaddresslabs.url}")
    private String ipAddressLabsUrl;
    @Value("${api.mapquest.key}")
    private String mapQuestReverseKey;
    @Value("${api.mapquest.reverse.url}")
    private String mapQuestReverseUrl;
    @Autowired
    private SearchResource searchResource;
    @Autowired
    private RestTemplate restTemplate;

    public List<String> types(SearchParams searchParams) {
        if (!searchParams.getCity().isFilled()) {
            return Lists.newArrayList();
        }
        ParamsSearchDto query = new ParamsSearchDto(searchParams.getCity().getLocation());
        query.setDate(searchParams.getDate());
        return searchResource.types(query).getTypes();
    }

    public Map<String, Long> tags(SearchParams searchParams) {
        if (!searchParams.getCity().isFilled()) {
            return Maps.newHashMap();
        }
        ParamsSearchDto query = new ParamsSearchDto(searchParams.getCity().getLocation());
        query.setDate(searchParams.getDate());
        return searchResource.tags(query).getTags();
    }

    public CitySearch getCityFromIp(String ipAddress) {
        // Local
        if (StringUtils.equals(ipAddress, "0:0:0:0:0:0:0:1")) {
            CitySearch citySearch = new CitySearch();
            citySearch.generateDefaultCity(true, false);
            return citySearch;
        }

        Map<String, String> parameters = Maps.newHashMap();
        parameters.put("key", ipAddressLabsKey);
        parameters.put("ipAddress", ipAddress);
        IpAddressLabsResponse response = restTemplate.getForObject(ipAddressLabsUrl, IpAddressLabsResponse.class, parameters);
        CitySearch citySearch = new CitySearch();
        citySearch.generateDefaultCity(false, false);
        if (response.getQuery_status().getQuery_status_code().equals("OK")) {
            final String countryCode = StringUtils.toLowerCase(response.getGeolocation_data().getCountry_code_iso3166alpha2(), Locale.getDefault());
            if (countryCodes.containsKey(countryCode)) {
                LOGGER.info("Found country {} for IP {}", countryCode, ipAddress);
                citySearch.setCountry(response.getGeolocation_data().getCountry_name());
                citySearch.setCovered(true);
                return citySearch;
            } else {
                LOGGER.error("Country code {} found but not allowed for IP {}", countryCode, ipAddress);
            }
        } else {
            LOGGER.error("Error {} while looking for country with IP {}", response.getQuery_status().getQuery_status_description(), ipAddress);
        }
        return citySearch;
    }

    public CitySearch getCityFromPoint(PointDto pointDto) {
        Map<String, String> parameters = Maps.newHashMap();
        parameters.put("key", mapQuestReverseKey);
        parameters.put("location", pointDto.toLocationString());
        MapQuestReverseResponse response = restTemplate.getForObject(mapQuestReverseUrl, MapQuestReverseResponse.class, parameters);
        CitySearch citySearch = new CitySearch();
        if (!CollectionUtils.isEmpty(response.getResults()) && !CollectionUtils.isEmpty(response.getResults().get(0).getLocations())) {
            final MapQuestReverseResponse.MapQuestReverseLocation location = response.getResults().get(0).getLocations().get(0);
            final String countryCode = StringUtils.toLowerCase(location.getAdminArea1(), Locale.getDefault());
            LOGGER.info("Found country {} for location {}", countryCode, pointDto);
            if (countryCodes.containsKey(countryCode)) {
                citySearch.setName(location.getAdminArea5());
                citySearch.setLocation(pointDto);
                citySearch.setCountry(countryCodes.get(countryCode));
                citySearch.setCovered(true);
                return citySearch;
            }
        }
        LOGGER.error("Error while reverse geocoding for location {}", pointDto);
        citySearch.generateDefaultCity(false, false);
        return citySearch;
    }
}
