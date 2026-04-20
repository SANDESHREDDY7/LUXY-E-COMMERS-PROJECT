package com.luxe.backend.repository;

import com.luxe.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartIdAndProductIdAndSelectedColor(Long cartId, Long productId, String selectedColor);
}
