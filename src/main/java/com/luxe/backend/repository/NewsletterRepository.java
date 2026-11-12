package com.luxe.backend.repository;

import com.luxe.backend.model.NewsletterSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NewsletterRepository extends JpaRepository<NewsletterSubscription, Long> {

    Optional<NewsletterSubscription> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
