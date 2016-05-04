package fr.littlereddot.pocket.site.entity;

import com.google.common.collect.Maps;
import fr.littlereddot.pocket.core.entity.enums.SiteType;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Random;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TypesParams {
    private Map<String, Integer> indexes = Maps.newHashMap();

    public TypesParams() {
        Random random = new Random();
        for (SiteType siteType : SiteType.values()) {
            indexes.put(siteType.name().toLowerCase(), random.nextInt(siteType.getPictureNumber()));
        }
    }

    public Integer getIndex(String type) {
        if (indexes.containsKey(type)) {
            return indexes.get(type);
        }
        return 0;
    }
}
