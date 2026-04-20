package com.luxe.backend.controller;

import com.luxe.backend.dto.PaymentIntentResponse;
import com.luxe.backend.service.CartService;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Value("${stripe.api.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.api.publishable.key}")
    private String stripePublishableKey;

    private final CartService cartService;

    public PaymentController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(@RequestBody Map<String, String> body) {
        String sessionId = body.get("sessionId");
        if (sessionId == null || sessionId.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            BigDecimal total = cartService.getCartTotal(sessionId);
            // Stripe expects amounts in cents
            long amountInCents = total.multiply(new BigDecimal(100)).longValue();

            if (amountInCents <= 0) {
                return ResponseEntity.badRequest().build();
            }

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("usd")
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            return ResponseEntity.ok(new PaymentIntentResponse(intent.getClientSecret(), stripePublishableKey));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
