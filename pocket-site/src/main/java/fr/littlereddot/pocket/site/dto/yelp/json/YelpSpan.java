package fr.littlereddot.pocket.site.dto.yelp.json;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
public class YelpSpan {

    private double latitudeDelta;
    private double longitudeDelta;

    public double getLatitudeDelta() {
        return latitudeDelta;
    }

    public void setLatitudeDelta(double latitudeDelta) {
        this.latitudeDelta = latitudeDelta;
    }

    public double getLongitudeDelta() {
        return longitudeDelta;
    }

    public void setLongitudeDelta(double longitudeDelta) {
        this.longitudeDelta = longitudeDelta;
    }
}
