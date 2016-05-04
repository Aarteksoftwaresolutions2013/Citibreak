package fr.littlereddot.pocket.site.controller;

import fr.littlereddot.pocket.client.resource.AgendaResource;
import fr.littlereddot.pocket.core.entity.DayOut;
import fr.littlereddot.pocket.core.entity.History;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Dmitriy Khvatov (<i>dimax4@gmail.com</i>)
 * @version $Id$
 */
@Controller
@RequestMapping("/agenda")
public class AgendaController extends AbstractController {

    @Autowired
    private MessageSource messageSource;
    @Autowired
    private AgendaResource agendaResource;

    private static final String VENUE_TYPE_PROPERTY_PREFIX = "search.stream.venue.type.";

    @RequestMapping(value = "/{uuid}", method = RequestMethod.GET)
    public String get(final Model model, @PathVariable final String uuid) {
        DayOut dayOut = agendaResource.getByUuid(uuid);
        model.addAttribute("agenda", dayOut);
        model.addAttribute("agendaDescription", getAgendaDescription(dayOut));
        return "agenda";
    }

    private Object getAgendaDescription(DayOut dayOut) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < dayOut.getEntries().size(); i++) {
            History.Entry entry = dayOut.getEntries().get(i);
            sb.append(' ').append(i + 1).append(". ")
                    .append(messageSource.getMessage(VENUE_TYPE_PROPERTY_PREFIX + entry.getType().toString(),
                            new Object[]{}, LocaleContextHolder.getLocale())).append(" - ")
                    .append(entry.getName()).append(" / ")
                    .append(entry.getAddress().replaceAll("<(.|\n)*?>", " "));
        }
        return sb.toString();
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "agenda";
    }
}
