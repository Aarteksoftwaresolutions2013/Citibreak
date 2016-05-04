package fr.littlereddot.pocket.site.entity;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import fr.littlereddot.pocket.core.entity.enums.TagType;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TagsParams {
    private static final List<String> COLORS = Lists.newArrayList("turquoise", "emerald", "river", "amethyst", "asphalt",
            "flower", "carrot", "alizarin", "clouds");
    private List<String> availableColors = Lists.newArrayList(COLORS);
    private Map<String, String> colors = Maps.newHashMap();
    private Map<String, Integer> indexes = Maps.newHashMap();

    public TagsParams() {
        Random random = new Random();
        for (TagType tagType : TagType.values()) {
            indexes.put(tagType.name().toLowerCase(), random.nextInt(tagType.getPictureNumber()));
        }
    }

    public String getColor(String tag) {
        if (!colors.containsKey(tag)) {
            if (availableColors.isEmpty()) {
                availableColors = Lists.newArrayList(COLORS);
            }
            Random random = new Random();
            colors.put(tag, availableColors.remove(random.nextInt(availableColors.size())));
        }
        return colors.get(tag);
    }

    public Integer getIndex(String type) {
        if (indexes.containsKey(type)) {
            return indexes.get(type);
        }
        return 0;
    }
}
