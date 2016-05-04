package fr.littlereddot.pocket.site.controller;

import com.google.common.collect.Lists;
import fr.littlereddot.pocket.core.dto.request.ReportDto;
import fr.littlereddot.pocket.core.dto.response.ReportResultDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.zendesk.client.v2.Zendesk;
import org.zendesk.client.v2.model.Comment;
import org.zendesk.client.v2.model.Priority;
import org.zendesk.client.v2.model.Ticket;
import org.zendesk.client.v2.model.Type;

@Controller
@RequestMapping("/contact")
public class ContactController extends AbstractController {

    @Autowired
    private Zendesk.Builder zendeskBuilder;

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST)
    public ReportResultDto save(ReportDto reportDto) {
        Zendesk zendesk = zendeskBuilder.build();
        Ticket.Requester requester = new Ticket.Requester(reportDto.fullName(), reportDto.getEmail());
        Comment comment = new Comment(reportDto.getComment());
        Ticket ticket = new Ticket(requester, reportDto.getSubject(), comment);
        ticket.setType(Type.QUESTION);
        ticket.setPriority(Priority.NORMAL);
        ticket.setTags(Lists.newArrayList(reportDto.getCountry()));
        ticket.setAssigneeId(523725352L);
        zendesk.createTicket(ticket);
        zendesk.close();
        return new ReportResultDto();
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
