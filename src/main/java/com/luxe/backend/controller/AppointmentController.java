package com.luxe.backend.controller;

import com.luxe.backend.model.Appointment;
import com.luxe.backend.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // POST /api/appointments/book
    // Body: { "firstName": "Jane", "lastName": "Doe", "email": "...", "phone": "...",
    //         "preferredDate": "2026-05-01", "preferredTime": "10:00 AM",
    //         "interestCollections": "Handbags", "notes": "..." }
    @PostMapping("/book")
    public ResponseEntity<Map<String, Object>> bookAppointment(@RequestBody Appointment appointment) {
        if (appointment.getFirstName() == null || appointment.getFirstName().isEmpty()) {
            throw new RuntimeException("First name is required");
        }
        if (appointment.getEmail() == null || appointment.getEmail().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        Appointment saved = appointmentService.bookAppointment(appointment);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Your appointment request has been received. We will confirm shortly.");
        response.put("appointmentId", saved.getId());
        response.put("status", saved.getStatus());
        return ResponseEntity.ok(response);
    }

    // GET /api/appointments                  → all appointments
    // GET /api/appointments?status=PENDING   → filter by status
    // GET /api/appointments?email=jane@x.com → filter by email
    @GetMapping
    public ResponseEntity<List<Appointment>> getAppointments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String email) {

        if (email != null && !email.isEmpty()) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByEmail(email));
        }
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
        }
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    // GET /api/appointments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    // PUT /api/appointments/{id}/confirm
    @PutMapping("/{id}/confirm")
    public ResponseEntity<Appointment> confirmAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id));
    }

    // PUT /api/appointments/{id}/cancel
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    // PUT /api/appointments/{id}/complete
    @PutMapping("/{id}/complete")
    public ResponseEntity<Appointment> completeAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.completeAppointment(id));
    }

    // DELETE /api/appointments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Appointment deleted successfully");
        return ResponseEntity.ok(response);
    }
}
