package com.luxe.backend.controller;

import com.luxe.backend.model.Review;
import com.luxe.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/product/{productId}")
    public List<Review> getProductReviews(@PathVariable Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    @PostMapping
    public Review postReview(@RequestBody Review review) {
        return reviewRepository.save(review);
    }
}
