package com.artvista.backend.repository;

import com.artvista.backend.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportTicketRepository
        extends JpaRepository<SupportTicket, Long> {

    List<SupportTicket> findByUserId(Long userId);
    List<SupportTicket> findAllByOrderByCreatedAtDesc();
}