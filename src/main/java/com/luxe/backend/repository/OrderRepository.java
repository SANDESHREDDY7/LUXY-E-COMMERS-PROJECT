package com.luxe.backend.repository;

import com.luxe.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findBySessionIdOrderByCreatedAtDesc(String sessionId);
    List<Order> findAllByOrderByCreatedAtDesc();
}
