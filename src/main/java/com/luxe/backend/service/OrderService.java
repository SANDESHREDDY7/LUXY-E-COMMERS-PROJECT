package com.luxe.backend.service;

import com.luxe.backend.dto.PlaceOrderRequest;
import com.luxe.backend.model.Cart;
import com.luxe.backend.model.CartItem;
import com.luxe.backend.model.Order;
import com.luxe.backend.model.OrderItem;
import com.luxe.backend.repository.CartRepository;
import com.luxe.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;
    private final EmailService emailService;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        CartService cartService,
                        EmailService emailService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartService = cartService;
        this.emailService = emailService;
    }

    @Transactional
    public Order placeOrder(PlaceOrderRequest request) {
        Cart cart = cartRepository.findBySessionId(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Cart not found for session"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot place an order with an empty cart");
        }

        Order order = new Order();
        order.setSessionId(request.getSessionId());
        order.setFirstName(request.getFirstName());
        order.setLastName(request.getLastName());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());
        order.setCity(request.getCity());
        order.setZip(request.getZip());
        order.setCountry(request.getCountry());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentIntentId(request.getPaymentIntentId());
        order.setStatus("PAID"); 

        BigDecimal total = cart.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(cartItem.getProduct().getId());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setSelectedColor(cartItem.getSelectedColor());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getUnitPrice());
            return orderItem;
        }).collect(Collectors.toList());

        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear the cart after successful order
        cartService.clearCart(request.getSessionId());

        // Send confirmation email
        emailService.sendOrderConfirmationEmail(savedOrder);

        return savedOrder;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> getOrdersBySession(String sessionId) {
        return orderRepository.findBySessionIdOrderByCreatedAtDesc(sessionId);
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
