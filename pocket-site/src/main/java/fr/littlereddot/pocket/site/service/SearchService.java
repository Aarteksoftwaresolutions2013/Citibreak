package fr.littlereddot.pocket.site.service;

import com.google.common.collect.Sets;
import fr.littlereddot.pocket.client.resource.SearchResource;
import fr.littlereddot.pocket.core.dto.response.SitesResponseDto;
import fr.littlereddot.pocket.core.dto.search.ParamsSearchDto;
import fr.littlereddot.pocket.core.entity.SpecialEvent;
import fr.littlereddot.pocket.site.entity.SearchParams;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Service
public class SearchService {

    @Autowired
    private SearchResource searchResource;

    public SitesResponseDto search(String indexType, Boolean indexTypeOnly, SearchParams searchParams, Integer limit) {
        ParamsSearchDto paramsSearchDto = new ParamsSearchDto(indexType, indexTypeOnly, searchParams.getDate(), searchParams.getTime(),
                searchParams.getCity().getLocation(), limit);
        paramsSearchDto.setTags(searchParams.getTags());
        return searchResource.params(paramsSearchDto);
    }

    public SitesResponseDto around(String indexType, Boolean indexTypeOnly, SearchParams searchParams, Integer limit) {
        ParamsSearchDto paramsSearchDto = new ParamsSearchDto(indexType, indexTypeOnly, searchParams.getDate(), searchParams.getTime(),
                searchParams.getCity().getLocation(), limit);
        return searchResource.params(paramsSearchDto);
    }

    public SitesResponseDto search(String indexType, Boolean indexTypeOnly, String category, SearchParams searchParams, Integer limit) {
        ParamsSearchDto paramsSearchDto = new ParamsSearchDto(indexType, indexTypeOnly, searchParams.getDate(), searchParams.getTime(),
                searchParams.getCity().getLocation(), limit);
        paramsSearchDto.setCategory(category);
        return searchResource.params(paramsSearchDto);
    }

    public SitesResponseDto special(String indexType, Boolean indexTypeOnly, SearchParams searchParams, Integer limit) {
        ParamsSearchDto paramsSearchDto = new ParamsSearchDto(indexType, indexTypeOnly, searchParams.getDate(), searchParams.getTime(),
                searchParams.getCity().getLocation(), limit);
        paramsSearchDto.setSpecialEvents(true);
        return searchResource.params(paramsSearchDto);
    }

    public SitesResponseDto free(String indexType, Boolean indexTypeOnly, SearchParams searchParams, Integer limit) {
        ParamsSearchDto paramsSearchDto = new ParamsSearchDto(indexType, indexTypeOnly, searchParams.getDate(), searchParams.getTime(),
                searchParams.getCity().getLocation(), limit);
        paramsSearchDto.setFree(true);
        return searchResource.params(paramsSearchDto);
    }

    public SitesResponseDto family(String indexType, Boolean indexTypeOnly, SearchParams searchParams, Integer limit) {
        ParamsSearchDto paramsSearchDto = new ParamsSearchDto(indexType, indexTypeOnly, searchParams.getDate(), searchParams.getTime(),
                searchParams.getCity().getLocation(), limit);
        paramsSearchDto.setTags(Sets.newHashSet("PASSER_UN_BON_MOMENT_EN_FAMILLE"));
        return searchResource.params(paramsSearchDto);
    }

    public SitesResponseDto recent(String indexType, Boolean indexTypeOnly, SearchParams searchParams, Integer limit) {
        ParamsSearchDto paramsSearchDto = new ParamsSearchDto(indexType, indexTypeOnly, searchParams.getDate(), searchParams.getTime(),
                searchParams.getCity().getLocation(), limit);
        paramsSearchDto.setRecent(true);
        return searchResource.params(paramsSearchDto);
    }

    public SpecialEvent special(DateTime dateTime) {
        return searchResource.special(dateTime);
    }
}
