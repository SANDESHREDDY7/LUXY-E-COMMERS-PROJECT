package com.luxe.backend.service;

import com.luxe.backend.model.NewsletterSubscription;
import com.luxe.backend.repository.NewsletterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NewsletterService {

    private final NewsletterRepository newsletterRepository;
    private final EmailService emailService;

    public NewsletterService(NewsletterRepository newsletterRepository, EmailService emailService) {
        this.newsletterRepository = newsletterRepository;
        this.emailService = emailService;
    }

    public NewsletterSubscription subscribe(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email cannot be empty");
        }

        String normalizedEmail = email.trim().toLowerCase();

        return newsletterRepository.findByEmailIgnoreCase(normalizedEmail)
                .map(existing -> {
                    if ("UNSUBSCRIBED".equals(existing.getStatus())) {
                        existing.setStatus("ACTIVE");
                        return newsletterRepository.save(existing);
                    }
                    // Already active — return as-is
                    return existing;
                })
                .orElseGet(() -> {
                    NewsletterSubscription sub = new NewsletterSubscription();
                    sub.setEmail(normalizedEmail);
                    NewsletterSubscription saved = newsletterRepository.save(sub);

                    // Send welcome email
                    emailService.sendNewsletterWelcomeEmail(normalizedEmail);

                    return saved;
                });
    }

    public NewsletterSubscription unsubscribe(String email) {
        NewsletterSubscription sub = newsletterRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Email not found in newsletter list: " + email));
        sub.setStatus("UNSUBSCRIBED");
        return newsletterRepository.save(sub);
    }

    public List<NewsletterSubscription> getAllSubscriptions() {
        return newsletterRepository.findAll();
    }

    public boolean isSubscribed(String email) {
        return newsletterRepository.findByEmailIgnoreCase(email)
                .map(sub -> "ACTIVE".equals(sub.getStatus()))
                .orElse(false);
    }
}
