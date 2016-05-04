package fr.littlereddot.pocket.site.dto.ipaddresslabs;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
public class IpAddressLabsResponse {
    private IpAddressLabsQueryStatus query_status;
    private String ip_address;
    private IpAddressLabGeolocationData geolocation_data;

    public IpAddressLabsQueryStatus getQuery_status() {
        return query_status;
    }

    public void setQuery_status(IpAddressLabsQueryStatus query_status) {
        this.query_status = query_status;
    }

    public String getIp_address() {
        return ip_address;
    }

    public void setIp_address(String ip_address) {
        this.ip_address = ip_address;
    }

    public IpAddressLabGeolocationData getGeolocation_data() {
        return geolocation_data;
    }

    public void setGeolocation_data(IpAddressLabGeolocationData geolocation_data) {
        this.geolocation_data = geolocation_data;
    }

    public static class IpAddressLabsQueryStatus {
        private String query_status_code;
        private String query_status_description;

        public String getQuery_status_code() {
            return query_status_code;
        }

        public void setQuery_status_code(String query_status_code) {
            this.query_status_code = query_status_code;
        }

        public String getQuery_status_description() {
            return query_status_description;
        }

        public void setQuery_status_description(String query_status_description) {
            this.query_status_description = query_status_description;
        }
    }

    public static class IpAddressLabGeolocationData {
        private String continent_code;
        private String continent_name;
        private String country_code_iso3166alpha2;
        private String country_code_iso3166alpha3;
        private String country_code_iso3166numeric;
        private String country_name;
        private String region_code;
        private String region_name;

        public String getContinent_code() {
            return continent_code;
        }

        public void setContinent_code(String continent_code) {
            this.continent_code = continent_code;
        }

        public String getContinent_name() {
            return continent_name;
        }

        public void setContinent_name(String continent_name) {
            this.continent_name = continent_name;
        }

        public String getCountry_code_iso3166alpha2() {
            return country_code_iso3166alpha2;
        }

        public void setCountry_code_iso3166alpha2(String country_code_iso3166alpha2) {
            this.country_code_iso3166alpha2 = country_code_iso3166alpha2;
        }

        public String getCountry_code_iso3166alpha3() {
            return country_code_iso3166alpha3;
        }

        public void setCountry_code_iso3166alpha3(String country_code_iso3166alpha3) {
            this.country_code_iso3166alpha3 = country_code_iso3166alpha3;
        }

        public String getCountry_code_iso3166numeric() {
            return country_code_iso3166numeric;
        }

        public void setCountry_code_iso3166numeric(String country_code_iso3166numeric) {
            this.country_code_iso3166numeric = country_code_iso3166numeric;
        }

        public String getCountry_name() {
            return country_name;
        }

        public void setCountry_name(String country_name) {
            this.country_name = country_name;
        }

        public String getRegion_code() {
            return region_code;
        }

        public void setRegion_code(String region_code) {
            this.region_code = region_code;
        }

        public String getRegion_name() {
            return region_name;
        }

        public void setRegion_name(String region_name) {
            this.region_name = region_name;
        }
    }
}
