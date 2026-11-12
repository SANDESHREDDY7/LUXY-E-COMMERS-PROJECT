package com.luxe.backend.controller;

import com.luxe.backend.model.NewsletterSubscription;
import com.luxe.backend.service.NewsletterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    private final NewsletterService newsletterService;

    public NewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    // POST /api/newsletter/subscribe
    // Body: { "email": "john@example.com" }
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, Object>> subscribe(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        NewsletterSubscription sub = newsletterService.subscribe(email);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Thank you for subscribing to our newsletter!");
        response.put("email", sub.getEmail());
        response.put("status", sub.getStatus());
        return ResponseEntity.ok(response);
    }

    // POST /api/newsletter/unsubscribe
    // Body: { "email": "john@example.com" }
    @PostMapping("/unsubscribe")
    public ResponseEntity<Map<String, String>> unsubscribe(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        newsletterService.unsubscribe(email);
        Map<String, String> response = new HashMap<>();
        response.put("message", "You have been unsubscribed successfully.");
        return ResponseEntity.ok(response);
    }

    // GET /api/newsletter/check?email=john@example.com
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkSubscription(@RequestParam String email) {
        boolean subscribed = newsletterService.isSubscribed(email);
        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        response.put("subscribed", subscribed);
        return ResponseEntity.ok(response);
    }

    // GET /api/newsletter/subscribers  (admin use)
    @GetMapping("/subscribers")
    public ResponseEntity<List<NewsletterSubscription>> getAllSubscribers() {
        return ResponseEntity.ok(newsletterService.getAllSubscriptions());
    }
}
