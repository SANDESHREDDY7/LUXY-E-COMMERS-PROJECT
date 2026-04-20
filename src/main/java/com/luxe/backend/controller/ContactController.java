package com.luxe.backend.controller;

import com.luxe.backend.model.ContactMessage;
import com.luxe.backend.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    // POST /api/contact/submit
    // Body: { "firstName": "John", "lastName": "Doe", "email": "...", "phone": "...", "subject": "...", "message": "..." }
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitMessage(@RequestBody ContactMessage contactMessage) {
        if (contactMessage.getFirstName() == null || contactMessage.getFirstName().isEmpty()) {
            throw new RuntimeException("First name is required");
        }
        if (contactMessage.getEmail() == null || contactMessage.getEmail().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (contactMessage.getMessage() == null || contactMessage.getMessage().isEmpty()) {
            throw new RuntimeException("Message is required");
        }

        ContactMessage saved = contactService.submitMessage(contactMessage);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Your message has been received. We'll be in touch shortly.");
        response.put("id", saved.getId());
        return ResponseEntity.ok(response);
    }

    // GET /api/contact/messages             → all messages
    // GET /api/contact/messages?status=UNREAD → filtered by status
    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessage>> getMessages(
            @RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(contactService.getMessagesByStatus(status));
        }
        return ResponseEntity.ok(contactService.getAllMessages());
    }

    // GET /api/contact/messages/{id}
    @GetMapping("/messages/{id}")
    public ResponseEntity<ContactMessage> getMessage(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getMessageById(id));
    }

    // PUT /api/contact/messages/{id}/read
    @PutMapping("/messages/{id}/read")
    public ResponseEntity<ContactMessage> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.markAsRead(id));
    }

    // PUT /api/contact/messages/{id}/reply
    @PutMapping("/messages/{id}/reply")
    public ResponseEntity<ContactMessage> markAsReplied(@PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        String replyText = payload != null ? payload.get("replyText") : null;
        ContactMessage updated = contactService.markAsReplied(id, replyText);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/contact/messages/{id}
    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Map<String, String>> deleteMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Message deleted successfully");
        return ResponseEntity.ok(response);
    }
}
