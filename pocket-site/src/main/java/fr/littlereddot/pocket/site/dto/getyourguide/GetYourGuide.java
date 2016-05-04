package fr.littlereddot.pocket.site.dto.getyourguide;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlValue;
import java.util.List;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 */
public class GetYourGuide {
    @XmlRootElement(name = "response")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class Response {

        @XmlElement(name = "products")
        private Products products;

        public Products getProducts() {
            return products;
        }

        public void setProducts(Products products) {
            this.products = products;
        }
    }

    @XmlRootElement(name = "products")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class Products {
        @XmlElement(name = "product")
        private List<Product> products;

        public List<Product> getProducts() {
            return products;
        }

        public void setProducts(List<Product> products) {
            this.products = products;
        }
    }

    @XmlRootElement(name = "product")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class Product {
        @XmlElement
        private String title;
        @XmlElement
        private String url;
        @XmlElement
        private Price price;
        @XmlElement
        private Pictures pictures;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public Price getPrice() {
            return price;
        }

        public void setPrice(Price price) {
            this.price = price;
        }

        public Pictures getPictures() {
            return pictures;
        }

        public void setPictures(Pictures pictures) {
            this.pictures = pictures;
        }
    }

    @XmlRootElement(name = "price")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class Price {
        @XmlElement(name = "values")
        private Values values;

        public Values getValues() {
            return values;
        }

        public void setValues(Values values) {
            this.values = values;
        }
    }

    @XmlRootElement(name = "price")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class Values {
        @XmlElement(name = "value")
        private List<Value> values;

        public List<Value> getValues() {
            return values;
        }

        public void setValues(List<Value> values) {
            this.values = values;
        }
    }

    @XmlRootElement(name = "value")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class Value {
        @XmlAttribute
        private String currency;
        @XmlValue
        private Double amount;

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }
    }

    @XmlRootElement(name = "pictures")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class Pictures {
        @XmlElement(name = "picture")
        private List<Picture> pictures;

        public List<Picture> getPictures() {
            return pictures;
        }

        public void setPictures(List<Picture> pictures) {
            this.pictures = pictures;
        }
    }

    @XmlRootElement(name = "picture")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class Picture {
        @XmlElement(name = "file")
        private List<String> file;

        public List<String> getFile() {
            return file;
        }

        public void setFile(List<String> file) {
            this.file = file;
        }
    }


}
