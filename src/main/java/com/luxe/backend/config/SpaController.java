package com.luxe.backend.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * SPA Controller: Forwards all non-API, non-static routes to index.html
 * so that React Router can handle client-side routing.
 *
 * Without this, refreshing on /collection or /admin would return a 404.
 */
@Controller
public class SpaController {

    @GetMapping(value = {
        "/",
        "/collection",
        "/collection/{path}",
        "/product/{id}",
        "/about",
        "/contact",
        "/cart",
        "/checkout",
        "/wishlist",
        "/admin",
        "/admin/{path}"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
