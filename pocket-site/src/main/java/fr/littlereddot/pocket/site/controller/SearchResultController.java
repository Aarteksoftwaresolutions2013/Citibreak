package fr.littlereddot.pocket.site.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import fr.littlereddot.pocket.core.entity.Event;
import fr.littlereddot.pocket.core.entity.Site;
import fr.littlereddot.pocket.site.service.SearchResultService;

/**
 * 
 * @author patidar
 *
 */
@Controller
public class SearchResultController extends AbstractController {

	@Autowired
	private SearchResultService searchResultService;

	/**
	 * @author patidar
	 * @param request
	 * @return searchResult
	 */
	@RequestMapping(value = "/searchResult", method = RequestMethod.GET)
	public String login(final HttpServletRequest request) {
		return "searchResult";
	}

	/**
	 * @author patidar
	 * @param urlData
	 * @return List<Site>
	 */
	@ResponseBody
	@RequestMapping(value = "/getDataFromSite", method = RequestMethod.GET)
	public List<Site> post(@RequestParam(required = false) String urlData) {
		return searchResultService.getDataFromSite(urlData);
	}

	/**
	 * @author patidar
	 * @param urlData
	 * @return List<Event>
	 */
	@ResponseBody
	@RequestMapping(value = "/getDataFromEvent", method = RequestMethod.GET)
	public List<Event> getDataFromEvent(@RequestParam(required = false) String urlData) {
		return searchResultService.getDataFromEvent(urlData);
	}
}
