package fr.littlereddot.pocket.site.entity;

import com.google.common.collect.Lists;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class NavigationParam {
    private List<String> paths;

    public NavigationParam() {
        this.paths = Lists.newArrayList("/");
    }

    public String getLastPath() {
        int pathsCount = paths.size();
        if (pathsCount < 2) {
            return paths.get(0);
        }
        return paths.get(pathsCount - 2);
    }

    public String getCurrentPath() {
        int pathsCount = paths.size();
        return paths.get(pathsCount - 1).replaceAll("[\\?&]?lang=[a-z]{2}_[A-Z]{2}", "");
    }

    public void updatePath(HttpServletRequest request, int index) {
        String history = request.getParameter("history");
        if (StringUtils.equals("remove", history)) {
            if (this.paths.size() > 1) {
                this.paths.remove(this.paths.size() - 1);
            }
        } else if (StringUtils.equals("add", history)) {
            appendPath(request);
        } else {
            appendAtIndex(request, index);
        }
    }

    private void appendAtIndex(HttpServletRequest request, int index) {
        while (index > paths.size()) {
            this.paths.add(this.paths.get(paths.size() - 1));
        }
        this.paths = this.paths.subList(0, index);
        this.paths.add(getNextPath(request));
    }

    public void appendPath(HttpServletRequest request) {
        String history = request.getParameter("history");
        if (StringUtils.equals("remove", history)) {
            if (this.paths.size() > 1) {
                this.paths.remove(this.paths.size() - 1);
            }
        } else {
            String nextPath = getNextPath(request);
            if (!this.paths.contains(nextPath)) {
                this.paths.add(nextPath);
            }
        }
    }

    private String getNextPath(HttpServletRequest request) {
        String nextPath;
        if (StringUtils.isNotBlank(request.getQueryString())) {
            nextPath = request.getRequestURI() + "?" + StringUtils.replace(request.getQueryString(), "history=add", "history=remove");
        } else {
            nextPath = request.getRequestURI();
        }
        return nextPath;
    }

    public boolean isHome() {
        return StringUtils.equals(this.paths.get(0), "/") || StringUtils.startsWith(this.paths.get(0), "/home/");
    }

    public boolean isAssistant() {
        return StringUtils.equals(this.paths.get(0), "/assistant");
    }

    public boolean isFavorite() {
        return StringUtils.startsWith(this.paths.get(0), "/favorites/");
    }
}
