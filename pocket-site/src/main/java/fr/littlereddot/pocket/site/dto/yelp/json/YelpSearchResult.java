package fr.littlereddot.pocket.site.dto.yelp.json;

import java.util.List;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
public class YelpSearchResult {

    private YelpRegion region;
    private int total;
    private List<YelpBusiness> businesses;

    public YelpRegion getRegion() {
        return region;
    }

    public void setRegion(YelpRegion region) {
        this.region = region;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public List<YelpBusiness> getBusinesses() {
        return businesses;
    }

    public void setBusinesses(List<YelpBusiness> businesses) {
        this.businesses = businesses;
    }
}
