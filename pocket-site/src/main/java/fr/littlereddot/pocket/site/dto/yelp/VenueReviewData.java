package fr.littlereddot.pocket.site.dto.yelp;

import com.google.appengine.repackaged.com.google.common.base.Joiner;
import fi.foyt.foursquare.api.entities.CompleteTip;
import fi.foyt.foursquare.api.entities.Photo;
import fr.littlereddot.pocket.site.dto.yelp.json.YelpReview;

import java.util.Date;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
public class VenueReviewData {

    private String reviewer;
    private String reviewerImageUrl;
    private Date date;
    private String ratingImageUrl;
    private String text;

    public String getReviewer() {
        return reviewer;
    }

    public void setReviewer(String reviewer) {
        this.reviewer = reviewer;
    }

    public String getReviewerImageUrl() {
        return reviewerImageUrl;
    }

    public void setReviewerImageUrl(String reviewerImageUrl) {
        this.reviewerImageUrl = reviewerImageUrl;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getRatingImageUrl() {
        return ratingImageUrl;
    }

    public void setRatingImageUrl(String ratingImageUrl) {
        this.ratingImageUrl = ratingImageUrl;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public static VenueReviewData fromYelpReview(YelpReview input) {
        VenueReviewData review = new VenueReviewData();
        review.setDate(new Date(input.getTimeCreated()));
        review.setRatingImageUrl(input.getRatingImageUrl());
        review.setReviewer(input.getUser().getName());
        review.setText(input.getExcerpt());
        return review;
    }

    public static VenueReviewData fromFoursquareTip(CompleteTip tip) {
        VenueReviewData review = new VenueReviewData();
        review.setDate(new Date(tip.getCreatedAt() * 1000L));
        review.setReviewer(Joiner.on(' ').skipNulls()
                .join(new String[]{
                        tip.getUser().getFirstName(),
                        tip.getUser().getLastName()}));
        review.setReviewerImageUrl(getSizedPhoto(tip.getUser().getPhoto(), "64x64"));
        review.setText(tip.getText());
        return review;
    }

    private static String getSizedPhoto(Photo photo, String size) {
        return photo.getPrefix() + size + photo.getSuffix();
    }


}
