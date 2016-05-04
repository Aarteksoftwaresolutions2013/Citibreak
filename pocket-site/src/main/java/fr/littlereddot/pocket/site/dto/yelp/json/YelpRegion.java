package fr.littlereddot.pocket.site.dto.yelp.json;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
public class YelpRegion {

    private YelpSpan span;
    private YelpCenter center;

    public YelpSpan getSpan() {
        return span;
    }

    public void setSpan(YelpSpan span) {
        this.span = span;
    }

    public YelpCenter getCenter() {
        return center;
    }

    public void setCenter(YelpCenter center) {
        this.center = center;
    }
}
