package fr.littlereddot.pocket.site.controller;

import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.thymeleaf.util.UrlUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Writer;
import java.net.URL;

@Controller
@RequestMapping("/social/google")
public class GooglePlusController extends AbstractController {

    @RequestMapping(method = RequestMethod.GET)
    public void save(Writer responseWriter, @RequestParam final String url) throws IOException {
        URL checkUrl = new URL("https://plusone.google.com/_/+1/fastbutton?url=" + UrlUtils.encodeQueryParam(url));
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(checkUrl.openStream()));
        IOUtils.copy(bufferedReader, responseWriter);
    }

    @ModelAttribute("metaPageName")
    public String getMetaInfosPage() {
        return "general";
    }
}
