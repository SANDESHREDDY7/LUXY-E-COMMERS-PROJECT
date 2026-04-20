package com.luxe.backend.repository;

import com.luxe.backend.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findBySessionId(String sessionId);

    Optional<WishlistItem> findBySessionIdAndProductId(String sessionId, Long productId);

    boolean existsBySessionIdAndProductId(String sessionId, Long productId);

    void deleteBySessionIdAndProductId(String sessionId, Long productId);
}
