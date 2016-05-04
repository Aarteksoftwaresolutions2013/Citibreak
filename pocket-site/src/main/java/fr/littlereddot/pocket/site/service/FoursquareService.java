package fr.littlereddot.pocket.site.service;

import com.google.appengine.repackaged.com.google.common.collect.Sets;
import com.google.common.base.Objects;
import com.google.common.base.Predicate;
import com.google.common.base.Predicates;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import fi.foyt.foursquare.api.FoursquareApi;
import fi.foyt.foursquare.api.FoursquareApiException;
import fi.foyt.foursquare.api.Result;
import fi.foyt.foursquare.api.ResultMeta;
import fi.foyt.foursquare.api.entities.CompactVenue;
import fi.foyt.foursquare.api.entities.CompleteVenue;
import fi.foyt.foursquare.api.entities.Recommendation;
import fi.foyt.foursquare.api.entities.RecommendationGroup;
import fi.foyt.foursquare.api.entities.Recommended;
import fi.foyt.foursquare.api.io.DefaultIOHandler;
import fi.foyt.foursquare.api.io.IOHandler;
import fr.littlereddot.pocket.site.config.FoursquareConfig;
import fr.littlereddot.pocket.site.dto.yelp.VenueCategory;
import fr.littlereddot.pocket.site.dto.yelp.VenueData;
import fr.littlereddot.pocket.site.dto.yelp.VenueType;
import org.apache.commons.collections.CollectionUtils;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
@Service
public class FoursquareService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FoursquareService.class);
    private static final int SEARCH_RESULTS_LIMIT = 200;
    private static final int MAX_SEARCH_RESULTS = 30;

    private static final Map<VenueType, Set<String>> INCLUDE_CATEGORIES = new HashMap<VenueType, Set<String>>() {{
        put(VenueType.SHOPPING, Sets.newHashSet(
                "4bf58dd8d48988d127951735", // Arts & Crafts Store
                "4bf58dd8d48988d114951735", // Bookstore
                "52f2ab2ebcbc57f1066b8b31", // Chocolate Shop
                "4bf58dd8d48988d103951735", // Clothing Store
                "52f2ab2ebcbc57f1066b8b18", // Comic Shop
                "4bf58dd8d48988d10c951735", // Cosmetics Shop
                "4bf58dd8d48988d1f6941735", // Department Store
                "4bf58dd8d48988d122951735", // Electronics Store
                "4bf58dd8d48988d1f8941735", // Furniture / Home Store
                "4bf58dd8d48988d128951735", // Gift Shop
                "4bf58dd8d48988d1fb941735", // Hobby Shop
                "4bf58dd8d48988d111951735", // Jewelry Store
                "4bf58dd8d48988d1fe941735", // Music Store
                "52f2ab2ebcbc57f1066b8b1b", // Souvenir Shop
                "4bf58dd8d48988d1f3941735", // Toy / Game Store
                "4bf58dd8d48988d10b951735" // Video Game Store
        ));
    }};

    private static final Map<VenueType, Set<String>> EXCLUDE_CATEGORIES = new HashMap<VenueType, Set<String>>() {{
        put(VenueType.BAR, Sets.newHashSet(
                "53e510b7498ebcb1801b55d4", // Night Market
                "4bf58dd8d48988d11f941735", // Nightclub
                "4bf58dd8d48988d11a941735", // Other Nightlife
                "4bf58dd8d48988d1d6941735" // Strip Club
        ));
    }};

    @Autowired
    private FoursquareConfig foursquareConfig;
    private FoursquareApi api;
    private FoursquareApi userlessApi;

    private LoadingCache<FindVenuesQuery, List<VenueData>> venuesExploreCache = CacheBuilder.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(24, TimeUnit.HOURS)
            .build(new CacheLoader<FindVenuesQuery, List<VenueData>>() {
                @Override
                public List<VenueData> load(FindVenuesQuery query) throws Exception {
                    return exploreVenues(query.getVenueType(), query.getLocation(), query.getRadius(), query.getLanguage());
                }
            });

    private LoadingCache<GetVenueByIdQuery, VenueData> venuesCache = CacheBuilder.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(24, TimeUnit.HOURS)
            .build(new CacheLoader<GetVenueByIdQuery, VenueData>() {
                @Override
                public VenueData load(GetVenueByIdQuery key) throws Exception {
                    return getVenue(key.getId(), key.getVenueType(), key.getLanguage());
                }
            });

    @PostConstruct
    private void init() {
        IOHandler ioHandler = new DefaultIOHandler();
        api = new FoursquareApi(foursquareConfig.getApiKey(), foursquareConfig.getApiSecret(),
                foursquareConfig.getCallbackUrl(), foursquareConfig.getToken(), ioHandler);
        api.setVersion("20150101");
        api.setSkipNonExistingFields(true);
        userlessApi = new FoursquareApi(foursquareConfig.getApiKey(), foursquareConfig.getApiSecret(),
                foursquareConfig.getCallbackUrl());
        userlessApi.setVersion("20150101");
        userlessApi.setSkipNonExistingFields(true);
    }

    public List<VenueData> findVenues(VenueType type, Point location, double radius, String language) {
        try {
            return venuesExploreCache.get(new FindVenuesQuery(type, location, radius, language));
        } catch (ExecutionException e) {
            LOGGER.error("Foursquare search error", e);
            return Lists.newArrayList();
        }
    }

    public VenueData getVenue(String id, VenueType venueType, String language) {
        try {
            return venuesCache.get(new GetVenueByIdQuery(VenueData.decode(id), venueType, language));
        } catch (ExecutionException e) {
            LOGGER.error("Foursquare venue details error", e);
            return new VenueData();
        }
    }

    private List<VenueData> exploreVenues(final VenueType type, Point location, double radius, String language) throws FoursquareApiException {
        List<VenueData> result = Lists.newArrayList();
        try {
            api.setLocale(language);
            Result<Recommended> recommendedResult = api.venuesExplore(latLon(location), 0d, 0d, 0d, (int) radius, type.getFoursquareCategory().getName(), "", SEARCH_RESULTS_LIMIT, "");
            ResultMeta meta = recommendedResult.getMeta();
            LOGGER.info("Foursquare venues/explore API rate limit: {} requests per hour, {} requests left", meta.getRateLimit(), meta.getRateLimitRemaining());
            Recommended recommended = recommendedResult.getResult();
            RecommendationGroup[] recommendationGroups = recommended.getGroups();
            for (RecommendationGroup recommendationGroup : recommendationGroups) {
                Recommendation[] recommendations = recommendationGroup.getItems();
                for (Recommendation recommendation : recommendations) {
                    CompactVenue compactVenue = recommendation.getVenue();
                    result.add(VenueData.fromFoursquareVenue(compactVenue, type.getFoursquareCategory()));
                }
            }
        } catch (FoursquareApiException e) {
            LOGGER.error("Foursquare search error", e);
            throw e;
        }
        final Set<String> includeCategories = INCLUDE_CATEGORIES.get(type);
        final Set<String> excludeCategories = EXCLUDE_CATEGORIES.get(type);
        //noinspection ConstantConditions
        result = Lists.newArrayList(Iterables.getFirst(Iterables.partition(Iterables.filter(result,
                new Predicate<VenueData>() {
                    @Override
                    public boolean apply(VenueData venueData) {
                        return Iterables.any(venueData.getCategories(),
                                Predicates.and(
                                        new Predicate<VenueCategory>() {
                                            @Override
                                            public boolean apply(VenueCategory category) {
                                                return CollectionUtils.isEmpty(includeCategories) || includeCategories.contains(category.getId());
                                            }
                                        },
                                        new Predicate<VenueCategory>() {
                                            @Override
                                            public boolean apply(VenueCategory category) {
                                                return CollectionUtils.isEmpty(excludeCategories) || !excludeCategories.contains(category.getId());
                                            }
                                        }));
                    }
                }), MAX_SEARCH_RESULTS), Lists.<VenueData>newArrayList()));
        Collections.sort(result, new Comparator<VenueData>() {
            @Override
            public int compare(VenueData o1, VenueData o2) {
                return Integer.compare(Objects.firstNonNull(o1.getDistance(), -1), Objects.firstNonNull(o2.getDistance(), -1));
            }
        });
        return result;
    }

    private VenueData getVenue(ObjectId id, VenueType venueType, String language) throws FoursquareApiException {
        try {
            api.setLocale(language);
            Result<CompleteVenue> venueResult = api.venue(id.toHexString());
            ResultMeta meta = venueResult.getMeta();
            LOGGER.info("Foursquare venue/id API rate limit: {} requests per hour, {} requests left", meta.getRateLimit(), meta.getRateLimitRemaining());
            CompleteVenue venue = venueResult.getResult();
            return VenueData.fromFoursquareVenue(venue, venueType.getFoursquareCategory());
        } catch (FoursquareApiException e) {
            LOGGER.error("Foursquare venue details error", e);
            throw e;
        }
    }

    private static String latLon(Point location) {
        return location.getY() + "," + location.getX();
    }


    private class FindVenuesQuery {
        private final VenueType venueType;
        private final Point location;
        private final double radius;
        private final String language;

        public FindVenuesQuery(VenueType venueType, Point location, double radius, String language) {
            this.venueType = venueType;
            this.location = location;
            this.radius = radius;
            this.language = language;
        }

        public VenueType getVenueType() {
            return venueType;
        }

        public Point getLocation() {
            return location;
        }

        public double getRadius() {
            return radius;
        }

        public String getLanguage() {
            return language;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;

            FindVenuesQuery that = (FindVenuesQuery) o;

            if (Double.compare(that.radius, radius) != 0) return false;
            if (language != null ? !language.equals(that.language) : that.language != null) return false;
            if (!location.equals(that.location)) return false;
            if (venueType != that.venueType) return false;

            return true;
        }

        @Override
        public int hashCode() {
            int result;
            long temp;
            result = venueType.hashCode();
            result = 31 * result + location.hashCode();
            temp = Double.doubleToLongBits(radius);
            result = 31 * result + (int) (temp ^ (temp >>> 32));
            result = 31 * result + (language != null ? language.hashCode() : 0);
            return result;
        }
    }

    private class GetVenueByIdQuery {
        private final ObjectId id;
        private final String language;
        private final VenueType venueType;

        public GetVenueByIdQuery(ObjectId id, VenueType venueType, String language) {
            this.id = id;
            this.language = language;
            this.venueType = venueType;
        }

        public ObjectId getId() {
            return id;
        }

        public VenueType getVenueType() {
            return venueType;
        }

        public String getLanguage() {
            return language;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;

            GetVenueByIdQuery that = (GetVenueByIdQuery) o;

            if (!id.equals(that.id)) return false;
            if (language != null ? !language.equals(that.language) : that.language != null) return false;
            if (venueType != that.venueType) return false;

            return true;
        }

        @Override
        public int hashCode() {
            int result = id.hashCode();
            result = 31 * result + (language != null ? language.hashCode() : 0);
            result = 31 * result + venueType.hashCode();
            return result;
        }
    }
}
