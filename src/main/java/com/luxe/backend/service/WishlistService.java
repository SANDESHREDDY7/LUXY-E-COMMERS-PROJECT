package com.luxe.backend.service;

import com.luxe.backend.model.Product;
import com.luxe.backend.model.WishlistItem;
import com.luxe.backend.repository.ProductRepository;
import com.luxe.backend.repository.WishlistItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistItemRepository wishlistItemRepository,
                           ProductRepository productRepository) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
    }

    public List<WishlistItem> getWishlist(String sessionId) {
        return wishlistItemRepository.findBySessionId(sessionId);
    }

    @Transactional
    public WishlistItem addToWishlist(String sessionId, Long productId) {
        if (wishlistItemRepository.existsBySessionIdAndProductId(sessionId, productId)) {
            return wishlistItemRepository.findBySessionIdAndProductId(sessionId, productId)
                    .orElseThrow(() -> new RuntimeException("Wishlist item not found"));
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        WishlistItem item = new WishlistItem();
        item.setSessionId(sessionId);
        item.setProduct(product);
        return wishlistItemRepository.save(item);
    }

    @Transactional
    public void removeFromWishlist(String sessionId, Long productId) {
        if (!wishlistItemRepository.existsBySessionIdAndProductId(sessionId, productId)) {
            throw new RuntimeException("Product not found in wishlist");
        }
        wishlistItemRepository.deleteBySessionIdAndProductId(sessionId, productId);
    }

    public boolean isInWishlist(String sessionId, Long productId) {
        return wishlistItemRepository.existsBySessionIdAndProductId(sessionId, productId);
    }

    @Transactional
    public WishlistItem toggleWishlist(String sessionId, Long productId) {
        if (wishlistItemRepository.existsBySessionIdAndProductId(sessionId, productId)) {
            wishlistItemRepository.deleteBySessionIdAndProductId(sessionId, productId);
            return null; // removed
        } else {
            return addToWishlist(sessionId, productId);
        }
    }
}
