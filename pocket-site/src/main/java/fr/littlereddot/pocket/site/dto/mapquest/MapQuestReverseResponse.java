package fr.littlereddot.pocket.site.dto.mapquest;

import java.util.List;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
public class MapQuestReverseResponse {
    private List<MapQuestReverseResult> results;

    public List<MapQuestReverseResult> getResults() {
        return results;
    }

    public void setResults(List<MapQuestReverseResult> results) {
        this.results = results;
    }

    public static class MapQuestReverseResult {
        private List<MapQuestReverseLocation> locations;

        public MapQuestReverseResult() {
        }

        public List<MapQuestReverseLocation> getLocations() {
            return locations;
        }

        public void setLocations(List<MapQuestReverseLocation> locations) {
            this.locations = locations;
        }
    }

    public static class MapQuestReverseLocation {
        private String adminArea1Type;
        private String adminArea1;
        private String adminArea3Type;
        private String adminArea3;
        private String adminArea4Type;
        private String adminArea4;
        private String adminArea5Type;
        private String adminArea5;

        public String getAdminArea1Type() {
            return adminArea1Type;
        }

        public void setAdminArea1Type(String adminArea1Type) {
            this.adminArea1Type = adminArea1Type;
        }

        public String getAdminArea1() {
            return adminArea1;
        }

        public void setAdminArea1(String adminArea1) {
            this.adminArea1 = adminArea1;
        }

        public String getAdminArea3Type() {
            return adminArea3Type;
        }

        public void setAdminArea3Type(String adminArea3Type) {
            this.adminArea3Type = adminArea3Type;
        }

        public String getAdminArea3() {
            return adminArea3;
        }

        public void setAdminArea3(String adminArea3) {
            this.adminArea3 = adminArea3;
        }

        public String getAdminArea4Type() {
            return adminArea4Type;
        }

        public void setAdminArea4Type(String adminArea4Type) {
            this.adminArea4Type = adminArea4Type;
        }

        public String getAdminArea4() {
            return adminArea4;
        }

        public void setAdminArea4(String adminArea4) {
            this.adminArea4 = adminArea4;
        }

        public String getAdminArea5Type() {
            return adminArea5Type;
        }

        public void setAdminArea5Type(String adminArea5Type) {
            this.adminArea5Type = adminArea5Type;
        }

        public String getAdminArea5() {
            return adminArea5;
        }

        public void setAdminArea5(String adminArea5) {
            this.adminArea5 = adminArea5;
        }
    }
}
