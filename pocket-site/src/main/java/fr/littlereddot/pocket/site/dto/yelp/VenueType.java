package fr.littlereddot.pocket.site.dto.yelp;

import fr.littlereddot.pocket.core.entity.enums.HistoryEntryType;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
public enum VenueType {

    RESTAURANT("restaurants", new VenueCategory("4d4b7105d754a06374d81259", "food")),
    BAR("bars", new VenueCategory("4d4b7105d754a06376d81259", "drinks")),
    SHOPPING("shopping", new VenueCategory("4d4b7105d754a06378d81259", "shops"));

    VenueType(String yelpCategory, VenueCategory foursquareCategory) {
        this.yelpCategory = yelpCategory;
        this.foursquareCategory = foursquareCategory;
    }

    private String yelpCategory;
    private VenueCategory foursquareCategory;

    public String getYelpCategory() {
        return yelpCategory;
    }

    public VenueCategory getFoursquareCategory() {
        return foursquareCategory;
    }

    public HistoryEntryType getHistoryEntryType() {
        switch (this) {
            case RESTAURANT: return HistoryEntryType.RESTAURANT;
            case BAR: return HistoryEntryType.BAR;
            case SHOPPING: return HistoryEntryType.SHOPPING;
        }
        return HistoryEntryType.CULTURAL;
    }
}
