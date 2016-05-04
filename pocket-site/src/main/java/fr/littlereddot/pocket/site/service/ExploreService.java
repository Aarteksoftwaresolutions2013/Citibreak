package fr.littlereddot.pocket.site.service;

import fr.littlereddot.pocket.client.resource.ExploresResource;
import fr.littlereddot.pocket.core.dto.response.ExploresResponseDto;
import fr.littlereddot.pocket.core.dto.search.ExploresSearchDto;
import fr.littlereddot.pocket.core.entity.Explore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Created by Cedric on 29/11/2015.
 */
@Service
public class ExploreService {

    @Autowired
    private ExploresResource resources;

    public List<List<Explore>> getExploresAll() {
        final ExploresResponseDto result = resources.search(new ExploresSearchDto());
        Collections.sort(result.getExplores(), comparePosition());
        List<List<Explore>> groupedResult = getGroupList(result.getExplores());
        return groupedResult;
    }

    private List<List<Explore>> getGroupList(List<Explore> resultList) {
        int cnt = 0;
        List<List<Explore>> groupedResult = new ArrayList<>();
        List<Explore> group = new ArrayList<>();
        for (Explore explore : resultList) {
            group.add(explore);
            cnt++;
            if(cnt %4==0) {
                groupedResult.add(group);
                group = new ArrayList<>();
            }
        }
        if (!group.isEmpty()) {
            groupedResult.add(group);
        }
        return groupedResult;
    }

    private Comparator<Explore> comparePosition() {
        return new Comparator<Explore>() {
            @Override
            public int compare(Explore o1, Explore o2) {
                return o1.getPosition().compareTo(o2.getPosition());
            }
        };
    }

}
