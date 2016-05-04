package fr.littlereddot.pocket.site.dto.yelp;

import fi.foyt.foursquare.api.entities.Category;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
public class VenueCategory {

    private final String id;
    private final String name;

    public VenueCategory(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public static VenueCategory fromFoursquareCategory(Category category) {
        return new VenueCategory(category.getId(), category.getName());
    }
}
