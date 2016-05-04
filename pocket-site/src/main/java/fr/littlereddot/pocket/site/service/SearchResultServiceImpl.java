package fr.littlereddot.pocket.site.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fr.littlereddot.pocket.client.resource.EventResource;
import fr.littlereddot.pocket.client.resource.SiteResource;
import fr.littlereddot.pocket.core.entity.Event;
import fr.littlereddot.pocket.core.entity.Site;
import fr.littlereddot.pocket.site.IConstant.IConstant;

/**
 * 
 * @author patidar
 *
 */
@Service
public class SearchResultServiceImpl implements SearchResultService {

	@Autowired
	private SiteResource siteResource;

	@Autowired
	private EventResource eventResource;

	/**
	 * @author patidar
	 * @param urlData
	 * @return List<Site>
	 */
	public List<Site> getDataFromSite(String urlData) {
		String[] dataArray = urlData.split(",");
		String endDate = null;
		if (dataArray.length == IConstant.TWO)
			endDate = dataArray[IConstant.ONE];
		else
			endDate = dataArray[IConstant.TWO];
		return siteResource.getDataFromSite(dataArray[IConstant.ZERO], dataArray[IConstant.ONE], endDate);
	}

	/**
	 * @author patidar
	 * @param UrlData
	 * @return List<Event>
	 */
	@Override
	public List<Event> getDataFromEvent(String urlData) {
		String[] dataArray = urlData.split(",");
		String endDate = null;
		if (dataArray.length == IConstant.TWO)
			endDate = dataArray[IConstant.ONE];
		else
			endDate = dataArray[IConstant.TWO];
		return eventResource.getDataFromEvent(dataArray[IConstant.ZERO], dataArray[IConstant.ONE],endDate);
	}
}
