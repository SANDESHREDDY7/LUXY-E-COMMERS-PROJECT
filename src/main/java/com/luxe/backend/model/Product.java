package com.luxe.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String image;

    private String collections;

    // Stored as comma-separated values e.g. "Black,Midnight Blue"
    @Column(columnDefinition = "TEXT")
    private String colors;

    // Stored as pipe-separated values e.g. "Premium leather|Gold hardware"
    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getCollections() { return collections; }
    public void setCollections(String collections) { this.collections = collections; }

    public String getColors() { return colors; }
    public void setColors(String colors) { this.colors = colors; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Helper methods to convert stored strings to lists (for API responses)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public List<String> getColorList() {
        if (this.colors == null || this.colors.isEmpty()) return List.of();
        return Arrays.asList(this.colors.split(","));
    }

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    public List<String> getDetailList() {
        if (this.details == null || this.details.isEmpty()) return List.of();
        return Arrays.asList(this.details.split("\\|"));
    }
}
