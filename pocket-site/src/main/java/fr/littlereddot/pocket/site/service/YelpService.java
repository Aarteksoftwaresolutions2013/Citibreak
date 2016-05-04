package fr.littlereddot.pocket.site.service;

import com.google.common.base.Function;
import com.google.common.base.Joiner;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import fr.littlereddot.pocket.site.dto.yelp.VenueType;
import fr.littlereddot.pocket.core.entity.enums.YelpSortMode;
import fr.littlereddot.pocket.site.config.YelpConfig;
import fr.littlereddot.pocket.site.dto.yelp.VenueData;
import fr.littlereddot.pocket.site.dto.yelp.json.YelpBusiness;
import fr.littlereddot.pocket.site.dto.yelp.json.YelpSearchResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
public class YelpService {

    private static final Logger LOGGER = LoggerFactory.getLogger(YelpService.class);
    private static final String SEARCH_RESULTS_LIMIT = "20";
    private static final YelpSortMode SORT_MODE = YelpSortMode.RATING;

    @Autowired
    private YelpConfig.YelpClient yelpClient;
    private static final Gson GSON = new GsonBuilder()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
            .create();

    public List<VenueData> findVenues(Set<VenueType> types, Point location, double radius, String language) {
        Map<String, String> params = Maps.newHashMap();
        params.put("ll", latLon(location));
        params.put("category_filter", Joiner.on(',').join(Iterables.transform(types, new Function<VenueType, String>() {
            @Override
            public String apply(VenueType input) {
                return input.getYelpCategory();
            }
        })));
        params.put("radius_filter", String.valueOf(radius));
        params.put("limit", SEARCH_RESULTS_LIMIT);
        params.put("sort", String.valueOf(SORT_MODE.ordinal()));
        params.put("lang", language);
        String jsonResponse = yelpClient.search(params);
        LOGGER.trace("Response from Yelp: {}", jsonResponse);
        YelpSearchResult yelpSearchResult = deserialize(jsonResponse, YelpSearchResult.class);
        if (yelpSearchResult == null) {
            return Lists.newArrayList();
        }
        return Lists.transform(yelpSearchResult.getBusinesses(), new Function<YelpBusiness, VenueData>() {
            @Override
            public VenueData apply(YelpBusiness input) {
                return VenueData.fromYelpBusiness(input);
            }
        });
    }

    public VenueData getVenue(String id, String language) {
        Map<String, String> params = Maps.newHashMap();
        params.put("lang", language);
        String jsonResponse = yelpClient.getBusiness(id, params);
        LOGGER.trace("Response from Yelp: {}", jsonResponse);
        YelpBusiness business = deserialize(jsonResponse, YelpBusiness.class);
        if (business == null) {
            return null;
        }
        return VenueData.fromYelpBusiness(business);
    }

    private static <T> T deserialize(String json, Class<T> clazz) {
        T yelpSearchResult = null;
        try {
            yelpSearchResult = GSON.fromJson(json, clazz);
        } catch (Exception e) {
            LOGGER.error("Error deserializing Yelp response: {}, {}", json, e.getMessage());
        }
        return yelpSearchResult;
    }

    private static String latLon(Point location) {
        return location.getY() + "," + location.getX();
    }

}
