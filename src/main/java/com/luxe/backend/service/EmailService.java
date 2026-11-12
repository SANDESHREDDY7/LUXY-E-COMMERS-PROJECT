package com.luxe.backend.service;

import com.luxe.backend.model.Appointment;
import com.luxe.backend.model.Order;
import com.luxe.backend.model.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendNewsletterWelcomeEmail(String toEmail) {
        String subject = "Welcome to LUXÉ - Your Exclusive Access Awaits";
        String text = "Dear Fashion Enthusiast,\n\n" +
                "Thank you for subscribing to the LUXÉ newsletter!\n\n" +
                "We are thrilled to welcome you to our community. You now have exclusive access to:\n" +
                "- Early previews of our upcoming collections\n" +
                "- Private sales and member-only events\n" +
                "- Style inspiration and care guides for your luxury pieces\n\n" +
                "Stay tuned for your first update.\n\n" +
                "Warm regards,\n" +
                "The LUXÉ Team";

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("hello@luxebag.com");
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(text);

                mailSender.send(message);
                System.out.println("Email successfully sent to: " + toEmail);
            } catch (MailException e) {
                logMockEmail(toEmail, subject, "Failed to send real email due to MailException. Logging instead:");
            }
        } else {
            logMockEmail(toEmail, subject, "SMTP is not configured. Logging instead:");
        }
    }

    public void sendContactReplyEmail(String toEmail, String originalSubject, String replyText) {
        String subject = "Re: " + (originalSubject != null ? originalSubject : "Your Inquiry");
        String text = "Dear Valued Customer,\n\n" +
                "Thank you for contacting LUXÉ. Here is our response to your inquiry:\n\n" +
                replyText + "\n\n" +
                "Warm regards,\n" +
                "The LUXÉ Client Services Team";

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("services@luxebag.com");
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(text);

                mailSender.send(message);
                System.out.println("Reply successfully sent to: " + toEmail);
            } catch (MailException e) {
                logMockEmail(toEmail, subject, "Failed to send real reply email. Logging instead:\n\n" + text);
            }
        } else {
            logMockEmail(toEmail, subject, "SMTP is not configured. Logging instead:\n\n" + text);
        }
    }

    public void sendOrderConfirmationEmail(Order order) {
        String subject = "Order Confirmation - LUXÉ #" + order.getId();
        
        StringBuilder itemDetails = new StringBuilder();
        for (OrderItem item : order.getItems()) {
            itemDetails.append("- ").append(item.getProductName())
                       .append(" (").append(item.getQuantity()).append("x) - ")
                       .append("$").append(item.getUnitPrice()).append("\n");
        }

        String text = String.format(
                "Dear %s,\n\n" +
                "Thank you for your order with LUXÉ. Your purchase is being prepared for shipment.\n\n" +
                "Order Summary:\n" +
                "Order ID: #LUXE-%d\n" +
                "Total Amount: $%s\n\n" +
                "Items:\n%s\n" +
                "Shipping Address:\n%s\n%s, %s\n\n" +
                "Our white-glove concierge team will contact you shortly to coordinate delivery.\n\n" +
                "Warm regards,\n" +
                "The LUXÉ Team",
                order.getFirstName(), order.getId(), order.getTotalAmount(), 
                itemDetails.toString(), order.getAddress(), order.getCity(), order.getZip()
        );

        sendEmail(order.getEmail(), subject, text, "Order confirmation");
    }

    public void sendAppointmentConfirmationEmail(Appointment appt) {
        String subject = "Appointment Confirmed - LUXÉ Concierge";
        
        String text = String.format(
                "Dear %s %s,\n\n" +
                "Your concierge appointment at LUXÉ has been confirmed.\n\n" +
                "Collection: %s\n" +
                "Date: %s\n" +
                "Time: %s\n" +
                "Notes: %s\n\n" +
                "Location: Our boutique or your preferred virtual platform.\n\n" +
                "We look forward to providing you with an exceptional luxury experience.\n\n" +
                "Warm regards,\n" +
                "The LUXÉ Concierge Team",
                appt.getFirstName(), appt.getLastName(), appt.getInterestCollections(), 
                appt.getPreferredDate(), appt.getPreferredTime(),
                (appt.getNotes() != null && !appt.getNotes().isEmpty() ? appt.getNotes() : "N/A")
        );

        sendEmail(appt.getEmail(), subject, text, "Appointment confirmation");
    }

    private void sendEmail(String toEmail, String subject, String text, String logContext) {
        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("concierge@luxebag.com");
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(text);

                mailSender.send(message);
                System.out.println(logContext + " successfully sent to: " + toEmail);
            } catch (MailException e) {
                logMockEmail(toEmail, subject, "Failed to send real " + logContext + ". Logging instead:\n\n" + text);
            }
        } else {
            logMockEmail(toEmail, subject, "SMTP is not configured. Logging " + logContext + " instead:\n\n" + text);
        }
    }

    private void logMockEmail(String to, String subject, String message) {
        System.out.println("\n====== MOCK EMAIL LOG ======");
        System.out.println(message);
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("============================\n");
    }
}
