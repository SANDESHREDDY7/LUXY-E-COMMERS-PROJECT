package com.luxe.backend.service;

import com.luxe.backend.model.Cart;
import com.luxe.backend.model.CartItem;
import com.luxe.backend.model.Product;
import com.luxe.backend.repository.CartItemRepository;
import com.luxe.backend.repository.CartRepository;
import com.luxe.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    // Get or create a cart for the given session
    public Cart getOrCreateCart(String sessionId) {
        return cartRepository.findBySessionId(sessionId)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setSessionId(sessionId);
                    return cartRepository.save(cart);
                });
    }

    // Add item to cart (or increment quantity if same product+color already present)
    @Transactional
    public Cart addToCart(String sessionId, Long productId, int quantity, String selectedColor) {
        Cart cart = getOrCreateCart(sessionId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        String color = (selectedColor == null || selectedColor.isEmpty()) ? "" : selectedColor;

        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndProductIdAndSelectedColor(cart.getId(), productId, color);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setSelectedColor(color);
            newItem.setUnitPrice(product.getPrice());
            cartItemRepository.save(newItem);
        }

        return cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    // Update quantity of a specific cart item
    @Transactional
    public Cart updateCartItemQuantity(String sessionId, Long cartItemId, int quantity) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found for session: " + sessionId));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this session's cart");
        }

        if (quantity <= 0) {
            cart.getItems().removeIf(i -> i.getId().equals(cartItemId));
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return cartRepository.save(cart);
    }

    // Remove a specific item from cart
    @Transactional
    public Cart removeFromCart(String sessionId, Long cartItemId) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found for session: " + sessionId));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this session's cart");
        }

        boolean removed = cart.getItems().removeIf(i -> i.getId().equals(cartItemId));
        if (!removed) {
            throw new RuntimeException("Item not found in this cart");
        }
        cartItemRepository.delete(item);

        return cartRepository.save(cart);
    }

    // Clear all items from cart
    @Transactional
    public Cart clearCart(String sessionId) {
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found for session: " + sessionId));

        cart.getItems().clear();
        return cartRepository.save(cart);
    }

    // Compute grand total
    public BigDecimal getCartTotal(String sessionId) {
        Cart cart = getOrCreateCart(sessionId);
        return cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
