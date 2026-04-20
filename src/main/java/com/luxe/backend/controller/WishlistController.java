package com.luxe.backend.controller;

import com.luxe.backend.model.WishlistItem;
import com.luxe.backend.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // GET /api/wishlist?sessionId=abc123
    @GetMapping
    public ResponseEntity<Map<String, Object>> getWishlist(@RequestParam String sessionId) {
        List<WishlistItem> items = wishlistService.getWishlist(sessionId);
        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        response.put("count", items.size());
        return ResponseEntity.ok(response);
    }

    // POST /api/wishlist/add?sessionId=abc123
    // Body: { "productId": 1 }
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToWishlist(
            @RequestParam String sessionId,
            @RequestBody Map<String, Object> body) {

        Long productId = Long.valueOf(body.get("productId").toString());
        WishlistItem item = wishlistService.addToWishlist(sessionId, productId);

        Map<String, Object> response = new HashMap<>();
        response.put("item", item);
        response.put("message", "Product added to wishlist");
        return ResponseEntity.ok(response);
    }

    // DELETE /api/wishlist/remove/{productId}?sessionId=abc123
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(
            @RequestParam String sessionId,
            @PathVariable Long productId) {

        wishlistService.removeFromWishlist(sessionId, productId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Product removed from wishlist");
        return ResponseEntity.ok(response);
    }

    // POST /api/wishlist/toggle?sessionId=abc123
    // Body: { "productId": 1 }
    // Adds if not present, removes if already present
    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleWishlist(
            @RequestParam String sessionId,
            @RequestBody Map<String, Object> body) {

        Long productId = Long.valueOf(body.get("productId").toString());
        WishlistItem item = wishlistService.toggleWishlist(sessionId, productId);

        Map<String, Object> response = new HashMap<>();
        if (item == null) {
            response.put("action", "removed");
            response.put("message", "Product removed from wishlist");
        } else {
            response.put("action", "added");
            response.put("item", item);
            response.put("message", "Product added to wishlist");
        }
        return ResponseEntity.ok(response);
    }

    // GET /api/wishlist/check/{productId}?sessionId=abc123
    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Object>> checkWishlist(
            @RequestParam String sessionId,
            @PathVariable Long productId) {

        boolean inWishlist = wishlistService.isInWishlist(sessionId, productId);
        Map<String, Object> response = new HashMap<>();
        response.put("inWishlist", inWishlist);
        return ResponseEntity.ok(response);
    }
}
