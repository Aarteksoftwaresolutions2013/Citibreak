package fr.littlereddot.pocket.site.dto.yelp;

import com.google.appengine.repackaged.com.google.common.base.Objects;
import com.google.common.base.Function;
import com.google.common.base.Joiner;
import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import fi.foyt.foursquare.api.entities.Category;
import fi.foyt.foursquare.api.entities.CompactVenue;
import fi.foyt.foursquare.api.entities.CompleteTip;
import fi.foyt.foursquare.api.entities.Location;
import fi.foyt.foursquare.api.entities.Photo;
import fi.foyt.foursquare.api.entities.PhotoGroup;
import fi.foyt.foursquare.api.entities.Photos;
import fi.foyt.foursquare.api.entities.TipGroup;
import fi.foyt.foursquare.api.entities.venue.Hours;
import fi.foyt.foursquare.api.entities.venue.Price;
import fi.foyt.foursquare.api.entities.venue.RenderedTime;
import fi.foyt.foursquare.api.entities.venue.Timeframe;
import fr.littlereddot.pocket.core.entity.Address;
import fr.littlereddot.pocket.site.dto.yelp.json.YelpBusiness;
import fr.littlereddot.pocket.site.dto.yelp.json.YelpReview;
import org.bson.types.ObjectId;
import org.springframework.data.geo.Point;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
public class VenueData {

    private static final Predicate<Photo> HORIZONTAL_PHOTO = new Predicate<Photo>() {
        @Override
        public boolean apply(Photo input) {
            return input.getWidth() > input.getHeight();
        }
    };

    private static final Predicate<Photo> SQUARE_PHOTO = new Predicate<Photo>() {
        @Override
        public boolean apply(Photo input) {
            return input.getWidth().equals(input.getHeight());
        }
    };

    private String id;

    private String name;
    private int distance;

    private Double rating;
    private String ratingImageUrl;
    private int reviewCount;
    private List<VenueCategory> categories;
    private String category;
    private String imageUrl;
    private Address address;
    private String displayAddress;
    private String formattedAddress;
    private String phone;
    private String url;
    private Point location;
    private List<VenueReviewData> reviews;
    private Integer price;
    private String hours;

    public VenueData() {
        this.categories = new ArrayList<>();
        this.reviews = new ArrayList<>();
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getRatingImageUrl() {
        return ratingImageUrl;
    }

    public void setRatingImageUrl(String ratingImageUrl) {
        this.ratingImageUrl = ratingImageUrl;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
    }

    public List<VenueCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<VenueCategory> categories) {
        this.categories = categories;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getDisplayAddress() {
        return displayAddress;
    }

    public void setDisplayAddress(String displayAddress) {
        this.displayAddress = displayAddress;
    }

    public String getFormattedAddress() {
        return formattedAddress;
    }

    public void setFormattedAddress(String formattedAddress) {
        this.formattedAddress = formattedAddress;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }

    public List<VenueReviewData> getReviews() {
        return reviews;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getHours() {
        return hours;
    }

    public void setHours(String hours) {
        this.hours = hours;
    }

    public void setReviews(List<VenueReviewData> reviews) {
        this.reviews = reviews;
    }

    public static VenueData fromYelpBusiness(YelpBusiness input) {
        VenueData venueData = new VenueData();
        venueData.setName(input.getName());
        if (input.getLocation() != null) {
            if (input.getLocation().getCoordinate() != null) {
                venueData.setLocation(new Point(input.getLocation().getCoordinate().getLatitude(), input.getLocation().getCoordinate().getLongitude()));
            }
            if (input.getLocation().getDisplayAddress() != null) {
                venueData.setDisplayAddress(Joiner.on(',').join(input.getLocation().getDisplayAddress()));
            }
        }
        venueData.setPhone(input.getDisplayPhone());
        venueData.setDistance((int) input.getDistance());
        venueData.setImageUrl(input.getImageUrl());
        venueData.setRatingImageUrl(input.getRatingImgUrl());
        venueData.setReviewCount(input.getReviewCount());
        venueData.setUrl(input.getUrl());
        venueData.setCategories(Lists.transform(input.getCategories(), new Function<List<String>, VenueCategory>() {
            @Override
            public VenueCategory apply(List<String> input) {
                return new VenueCategory(Iterables.getLast(input), Iterables.getFirst(input, ""));
            }
        }));
        venueData.setReviews(Lists.transform(input.getReviews(), new Function<YelpReview, VenueReviewData>() {
            @Override
            public VenueReviewData apply(YelpReview input) {
                return VenueReviewData.fromYelpReview(input);
            }
        }));
        return venueData;
    }

    public static VenueData fromFoursquareVenue(CompactVenue venue, VenueCategory defaultCategory) {
        VenueData venueData = new VenueData();
        venueData.setId(encode(venue.getId()).toHexString());
        venueData.setName(venue.getName());
        if (venue.getContact() != null) {
            venueData.setPhone(venue.getContact().getPhone());
        }
        Location venueLocation = venue.getLocation();
        if (venueLocation != null) {
            venueData.setLocation(new Point(venueLocation.getLng(), venueLocation.getLat()));
            venueData.setDisplayAddress(venueLocation.getAddress());
            venueData.setFormattedAddress(Joiner.on("<br/>").join(venueLocation.getFormattedAddress()));
            venueData.setDistance((int) Math.round(Objects.firstNonNull(venueLocation.getDistance(), -1.0d)));
            Address theAddress = new Address();
            theAddress.setStreet(venueLocation.getAddress());
            theAddress.setZipCode(venueLocation.getPostalCode());
            theAddress.setCity(venueLocation.getCity());
            theAddress.setCountry(venueLocation.getCountry());
            venueData.setAddress(theAddress);
        }
        venueData.setImageUrl(getHorizontalPhoto(venue.getPhotos(), "300x200"));
        venueData.setRating(venue.getRating());
        venueData.setUrl(venue.getUrl());
        if (venue.getCategories() != null) {
            venueData.setCategories(Lists.transform(Lists.newArrayList(venue.getCategories()), new Function<Category, VenueCategory>() {
                @Override
                public VenueCategory apply(Category input) {
                    return VenueCategory.fromFoursquareCategory(input);
                }
            }));
            venueData.setCategory(Iterables.getFirst(venueData.getCategories(), defaultCategory).getName());
        }
        List<VenueReviewData> reviewsList = Lists.newArrayList();
        if (venue.getTips() != null) {
            for (TipGroup group : venue.getTips().getGroups()) {
                for (CompleteTip tip : group.getItems()) {
                    reviewsList.add(VenueReviewData.fromFoursquareTip(tip));
                }
            }
        }
        Collections.sort(reviewsList, new Comparator<VenueReviewData>() {
            @Override
            public int compare(VenueReviewData o1, VenueReviewData o2) {
                return o2.getDate().compareTo(o1.getDate());
            }
        });
        venueData.setReviews(reviewsList);
        venueData.setPrice(Objects.firstNonNull(venue.getPrice(), new Price()).getTier());
        venueData.setHours(getHours(venue));
        return venueData;
    }

    private static String getHours(CompactVenue venue) {
        Hours hours = venue.getHours() != null ? venue.getHours() : venue.getPopular();
        String hoursStr = null;
        if (hours != null) {
            Timeframe currentTimeframe = null;
            if (hours.getTimeframes() != null) {
                for (Timeframe timeframe : hours.getTimeframes()) {
                    if (timeframe.getIncludesToday() != null && timeframe.getIncludesToday()) {
                        currentTimeframe = timeframe;
                        break;
                    }
                }
            }
            if (currentTimeframe != null && currentTimeframe.getOpen() != null) {
                hoursStr = Joiner.on(", ").join(
                        Iterables.transform(Lists.newArrayList(currentTimeframe.getOpen()),
                                new Function<RenderedTime, String>() {
                                    @Override
                                    public String apply(RenderedTime input) {
                                        return input.getRenderedTime();
                                    }
                                }));
            } else {
                hoursStr = hours.getStatus();
            }
        }
        return hoursStr;
    }

    private static String getHorizontalPhoto(Photos photos, String size) {
        if (photos == null) {
            return null;
        }
        PhotoGroup[] photoGroup = photos.getGroups();
        if (photoGroup == null || photoGroup.length == 0) {
            return null;
        }
        Photo[] photoItems = photoGroup[0].getItems();
        if (photoItems == null || photoItems.length == 0) {
            return null;
        }
        List<Photo> photoList = Lists.newArrayList(photoItems);
        return getSizedPhoto(Iterables.find(
                photoList, HORIZONTAL_PHOTO, Iterables.find(
                        photoList, SQUARE_PHOTO, photoItems[0])), size);
    }

    private static String getSizedPhoto(Photo photo, String size) {
        return photo.getPrefix() + size + photo.getSuffix();
    }

    private static ObjectId encode(String id) {
        ByteBuffer input = ByteBuffer.wrap(new ObjectId(id).toByteArray());
        ByteBuffer output = ByteBuffer.allocate(12);
        for (int i = 0; i < 3; i++) {
            output.putInt(i << 2, Integer.rotateLeft(input.getInt(i << 2), 1));
        }
        return new ObjectId(output.array());
    }

    public static ObjectId decode(String id) {
        ByteBuffer input = ByteBuffer.wrap(new ObjectId(id).toByteArray());
        ByteBuffer output = ByteBuffer.allocate(12);
        for (int i = 0; i < 3; i++) {
            output.putInt(i << 2, Integer.rotateRight(input.getInt(i << 2), 1));
        }
        return new ObjectId(output.array());
    }

}
