package com.luxe.backend.service;

import com.luxe.backend.model.Appointment;
import com.luxe.backend.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    public AppointmentService(AppointmentRepository appointmentRepository, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.emailService = emailService;
    }

    public Appointment bookAppointment(Appointment appointment) {
        Appointment saved = appointmentRepository.save(appointment);
        
        // Send confirmation email
        emailService.sendAppointmentConfirmationEmail(saved);
        
        return saved;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }

    public List<Appointment> getAppointmentsByEmail(String email) {
        return appointmentRepository.findByEmailIgnoreCase(email);
    }

    public Appointment confirmAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus("CONFIRMED");
        return appointmentRepository.save(appointment);
    }

    public Appointment cancelAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus("CANCELLED");
        return appointmentRepository.save(appointment);
    }

    public Appointment completeAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus("COMPLETED");
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointmentRepository.delete(appointment);
    }
}
