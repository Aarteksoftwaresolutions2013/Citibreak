/**
 * 
 */
package fr.littlereddot.pocket.site.service;

import java.util.List;

import fr.littlereddot.pocket.core.entity.Event;
import fr.littlereddot.pocket.core.entity.Site;

/**
 * @author patidar
 *
 */
public interface SearchResultService {

	/**
	 * @author patidar
	 * @param urlData
	 * @return
	 */
	List<Site> getDataFromSite(String urlData);

	/**
	 * @author patidar
	 * @param urlData
	 * @return
	 */
	List<Event> getDataFromEvent(String urlData);
}
