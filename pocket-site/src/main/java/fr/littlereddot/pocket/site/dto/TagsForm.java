package fr.littlereddot.pocket.site.dto;

import com.google.common.collect.Sets;

import java.util.Set;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
public class TagsForm {
    private Set<String> tags;

    public TagsForm() {
        this.tags = Sets.newHashSet();
    }

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
        this.tags = tags;
    }
}
