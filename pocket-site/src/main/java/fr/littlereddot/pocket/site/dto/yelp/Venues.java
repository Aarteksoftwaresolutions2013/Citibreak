package fr.littlereddot.pocket.site.dto.yelp;

import com.google.common.collect.Lists;

import java.util.List;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
public class Venues {

    private List<VenueData> venues;

    public Venues() {
        this.venues = Lists.newArrayList();
    }

    private Venues(List<VenueData> venuesList) {
        this.venues = venuesList;
    }

    public List<VenueData> getVenues() {
        return venues;
    }

    public void setVenues(List<VenueData> venues) {
        this.venues = venues;
    }

    public static Venues of(List<VenueData> venuesList) {
        return new Venues(venuesList);
    }
}
