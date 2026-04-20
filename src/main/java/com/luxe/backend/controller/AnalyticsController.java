package com.luxe.backend.controller;

import com.luxe.backend.model.Order;
import com.luxe.backend.model.OrderItem;
import com.luxe.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/summary")
    public Map<String, Object> getAnalyticsSummary() {
        List<Order> orders = orderRepository.findAll();
        
        // 1. Revenue over time (Last 30 days or all)
        Map<String, BigDecimal> revenueByDate = new TreeMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        for (Order order : orders) {
            String date = order.getCreatedAt().format(formatter);
            revenueByDate.put(date, revenueByDate.getOrDefault(date, BigDecimal.ZERO).add(order.getTotalAmount()));
        }

        // Convert to list for Recharts
        List<Map<String, Object>> revenueChart = revenueByDate.entrySet().stream()
            .map(entry -> {
                Map<String, Object> point = new HashMap<>();
                point.put("date", entry.getKey());
                point.put("revenue", entry.getValue());
                return point;
            })
            .collect(Collectors.toList());

        // 2. Best Sellers
        Map<String, Integer> productSales = new HashMap<>();
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                String name = item.getProductName();
                productSales.put(name, productSales.getOrDefault(name, 0) + item.getQuantity());
            }
        }

        List<Map<String, Object>> bestSellers = productSales.entrySet().stream()
            .map(entry -> {
                Map<String, Object> item = new HashMap<>();
                item.put("name", entry.getKey());
                item.put("sales", entry.getValue());
                return item;
            })
            .sorted((a, b) -> (Integer)b.get("sales") - (Integer)a.get("sales"))
            .limit(5)
            .collect(Collectors.toList());

        // 3. Overall Stats
        BigDecimal totalRevenue = orders.stream()
            .map(Order::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("revenueChart", revenueChart);
        response.put("bestSellers", bestSellers);
        response.put("totalRevenue", totalRevenue);
        response.put("totalOrders", orders.size());
        
        return response;
    }
}
