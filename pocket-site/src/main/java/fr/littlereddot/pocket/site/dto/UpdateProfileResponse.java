package fr.littlereddot.pocket.site.dto;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
public class UpdateProfileResponse {
    private boolean success;
    private String field;
    private String error;

    public UpdateProfileResponse(boolean success, String field, String error) {
        this.success = success;
        this.field = field;
        this.error = error;
    }

    public UpdateProfileResponse(boolean success) {
        this.success = success;
        this.field = null;
        this.error = null;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getField() {
        return field;
    }

    public String getError() {
        return error;
    }
}
