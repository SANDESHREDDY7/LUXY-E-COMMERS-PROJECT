package com.luxe.backend.repository;

import com.luxe.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByStatus(String status);

    List<Appointment> findByEmailIgnoreCase(String email);
}
