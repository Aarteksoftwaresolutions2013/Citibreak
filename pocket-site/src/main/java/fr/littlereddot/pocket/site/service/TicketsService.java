package fr.littlereddot.pocket.site.service;

import fr.littlereddot.pocket.core.dto.PointDto;
import fr.littlereddot.pocket.core.dto.response.CountDto;
import fr.littlereddot.pocket.core.dto.response.TicketsResponseDto;
import fr.littlereddot.pocket.core.entity.Ticket;
import fr.littlereddot.pocket.core.entity.enums.Currency;
import fr.littlereddot.pocket.site.dto.getyourguide.GetYourGuide;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import java.net.URL;
import java.util.Locale;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 */
@Service
public class TicketsService {
    private static final String QUERY_URL = "https://api.getyourguide.com/?partner_id=B3ITTW8472&language=fr&q=product_list&lat={0}&lng={1}";

    public TicketsResponseDto find(PointDto pointDto, Locale locale) {
        TicketsResponseDto responseDto = new TicketsResponseDto();
        try {
            String[] searchList = {"{0}", "{1}"};
            String[] replacementList = {String.valueOf(pointDto.getX()), String.valueOf(pointDto.getY())};
            URL url = new URL(StringUtils.replaceEach(QUERY_URL, searchList, replacementList));
            JAXBContext jaxbContext = JAXBContext.newInstance(GetYourGuide.Response.class);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            GetYourGuide.Response response = (GetYourGuide.Response) jaxbUnmarshaller.unmarshal(url.openStream());
            responseDto.setCount(new CountDto(response.getProducts().getProducts().size()));
            for (GetYourGuide.Product product : response.getProducts().getProducts()) {
                responseDto.getTickets().add(convert(product, locale));
            }
        } catch (Exception e) {
            responseDto.setCount(new CountDto(0));
        }
        return responseDto;
    }

    private Ticket convert(GetYourGuide.Product product, Locale locale) {
        Ticket ticket = new Ticket();
        ticket.setName(product.getTitle());
        ticket.setUrl(product.getUrl());
        GetYourGuide.Value priceValue = getValueFromLocale(product, locale);
        ticket.setPrice(priceValue.getAmount());
        ticket.setCurrency(Currency.fromValue(priceValue.getCurrency()));
        ticket.setImageUrl(product.getPictures().getPictures().get(0).getFile().get(0));
        return ticket;
    }

    private GetYourGuide.Value getValueFromLocale(GetYourGuide.Product product, Locale locale) {
        java.util.Currency userCurrency = java.util.Currency.getInstance(locale);
        Currency currency = Currency.fromValue(userCurrency.getCurrencyCode());
        for (GetYourGuide.Value value : product.getPrice().getValues().getValues()) {
            if (StringUtils.contains(currency.name(), value.getCurrency())) {
                return value;
            }
        }
        return product.getPrice().getValues().getValues().get(0);
    }
}
