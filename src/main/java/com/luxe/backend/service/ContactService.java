package com.luxe.backend.service;

import com.luxe.backend.model.ContactMessage;
import com.luxe.backend.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final EmailService emailService;

    public ContactService(ContactMessageRepository contactMessageRepository, EmailService emailService) {
        this.contactMessageRepository = contactMessageRepository;
        this.emailService = emailService;
    }

    public ContactMessage submitMessage(ContactMessage contactMessage) {
        return contactMessageRepository.save(contactMessage);
    }

    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    public List<ContactMessage> getMessagesByStatus(String status) {
        return contactMessageRepository.findByStatus(status);
    }

    public ContactMessage getMessageById(Long id) {
        return contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact message not found with id: " + id));
    }

    public ContactMessage markAsRead(Long id) {
        ContactMessage message = getMessageById(id);
        message.setStatus("READ");
        return contactMessageRepository.save(message);
    }

    public ContactMessage markAsReplied(Long id, String replyText) {
        ContactMessage message = getMessageById(id);
        message.setStatus("REPLIED");
        
        if (replyText != null && !replyText.trim().isEmpty()) {
            emailService.sendContactReplyEmail(message.getEmail(), message.getSubject(), replyText);
        }
        
        return contactMessageRepository.save(message);
    }

    public void deleteMessage(Long id) {
        ContactMessage message = getMessageById(id);
        contactMessageRepository.delete(message);
    }
}
