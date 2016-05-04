package fr.littlereddot.pocket.site.dto;

/**
 * @author DKhvatov
 */
public class NewsletterSubscriptionResponse {

    private boolean success;
    private String error;

    private NewsletterSubscriptionResponse(boolean success, String error) {
        this.success = success;
        this.error = error;
    }

    public static NewsletterSubscriptionResponse success() {
        return new NewsletterSubscriptionResponse(true, null);
    }

    public static NewsletterSubscriptionResponse error(String error) {
        return new NewsletterSubscriptionResponse(false, error);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
