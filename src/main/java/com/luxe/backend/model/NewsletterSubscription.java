package com.luxe.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "newsletter_subscription")
public class NewsletterSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    // "ACTIVE", "UNSUBSCRIBED"
    @Column(nullable = false)
    private String status;

    @Column(name = "subscribed_at")
    private LocalDateTime subscribedAt;

    @PrePersist
    public void prePersist() {
        if (this.subscribedAt == null) {
            this.subscribedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "ACTIVE";
        }
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSubscribedAt() { return subscribedAt; }
    public void setSubscribedAt(LocalDateTime subscribedAt) { this.subscribedAt = subscribedAt; }
}
