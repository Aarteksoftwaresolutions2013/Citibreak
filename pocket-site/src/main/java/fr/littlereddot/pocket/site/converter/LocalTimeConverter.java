package fr.littlereddot.pocket.site.converter;

import org.joda.time.LocalTime;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class LocalTimeConverter implements Converter<String, LocalTime> {
    @Override
    public LocalTime convert(final String source) {
        return LocalTime.MIDNIGHT.plusMinutes(Integer.valueOf(source));
    }
}