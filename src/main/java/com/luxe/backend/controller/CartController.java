package com.luxe.backend.controller;

import com.luxe.backend.model.Cart;
import com.luxe.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // GET /api/cart?sessionId=abc123
    @GetMapping
    public ResponseEntity<Map<String, Object>> getCart(@RequestParam String sessionId) {
        Cart cart = cartService.getOrCreateCart(sessionId);
        BigDecimal total = cartService.getCartTotal(sessionId);

        Map<String, Object> response = new HashMap<>();
        response.put("cart", cart);
        response.put("total", total);
        response.put("itemCount", cart.getItems().size());
        return ResponseEntity.ok(response);
    }

    // POST /api/cart/add
    // Body: { "productId": 1, "quantity": 1, "selectedColor": "Black" }
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(
            @RequestParam String sessionId,
            @RequestBody Map<String, Object> body) {

        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = body.containsKey("quantity") ? Integer.parseInt(body.get("quantity").toString()) : 1;
        String selectedColor = body.containsKey("selectedColor") ? body.get("selectedColor").toString() : "";

        Cart cart = cartService.addToCart(sessionId, productId, quantity, selectedColor);
        BigDecimal total = cartService.getCartTotal(sessionId);

        Map<String, Object> response = new HashMap<>();
        response.put("cart", cart);
        response.put("total", total);
        response.put("itemCount", cart.getItems().size());
        response.put("message", "Item added to cart");
        return ResponseEntity.ok(response);
    }

    // PUT /api/cart/item/{cartItemId}?sessionId=abc123
    // Body: { "quantity": 3 }
    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<Map<String, Object>> updateQuantity(
            @RequestParam String sessionId,
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Object> body) {

        int quantity = Integer.parseInt(body.get("quantity").toString());
        Cart cart = cartService.updateCartItemQuantity(sessionId, cartItemId, quantity);
        BigDecimal total = cartService.getCartTotal(sessionId);

        Map<String, Object> response = new HashMap<>();
        response.put("cart", cart);
        response.put("total", total);
        response.put("itemCount", cart.getItems().size());
        response.put("message", "Cart updated");
        return ResponseEntity.ok(response);
    }

    // DELETE /api/cart/item/{cartItemId}?sessionId=abc123
    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<Map<String, Object>> removeFromCart(
            @RequestParam String sessionId,
            @PathVariable Long cartItemId) {

        Cart cart = cartService.removeFromCart(sessionId, cartItemId);
        BigDecimal total = cartService.getCartTotal(sessionId);

        Map<String, Object> response = new HashMap<>();
        response.put("cart", cart);
        response.put("total", total);
        response.put("itemCount", cart.getItems().size());
        response.put("message", "Item removed from cart");
        return ResponseEntity.ok(response);
    }

    // DELETE /api/cart/clear?sessionId=abc123
    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearCart(@RequestParam String sessionId) {
        cartService.clearCart(sessionId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cart cleared successfully");
        return ResponseEntity.ok(response);
    }
}
