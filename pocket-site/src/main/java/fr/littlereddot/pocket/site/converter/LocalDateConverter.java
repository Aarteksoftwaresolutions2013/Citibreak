package fr.littlereddot.pocket.site.converter;

import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class LocalDateConverter implements Converter<String, LocalDate> {
    public static final String DATE_FORMAT = "YYYY-MM-dd";

    @Override
    public LocalDate convert(final String source) {
        return LocalDate.parse(source, DateTimeFormat.forPattern(DATE_FORMAT));
    }
}