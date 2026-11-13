package com.artvista.backend.service;

import com.artvista.backend.dto.TicketRequest;
import com.artvista.backend.dto.TicketResponse;
import com.artvista.backend.entity.SupportTicket;
import com.artvista.backend.entity.User;
import com.artvista.backend.repository.SupportTicketRepository;
import com.artvista.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportTicketService {

    @Autowired
    private  SupportTicketRepository ticketRepository;
    @Autowired
    private  UserRepository userRepository;

    public void createTicket(String email,TicketRequest request) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow();

        SupportTicket ticket = new SupportTicket();

        ticket.setTicketId(
                "TKT-" + System.currentTimeMillis()
        );

        ticket.setSubject(request.getSubject());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());

        ticket.setStatus("OPEN");

        ticket.setCreatedAt(
                LocalDateTime.now()
        );

        ticket.setUser(user);

        ticketRepository.save(ticket);
    }

    public List<TicketResponse> getMyTickets(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow();

        return ticketRepository
                .findByUserId(user.getId())
                .stream()
                .map(ticket ->
                        TicketResponse.builder()
                                .id(ticket.getId())
                                .ticketId(ticket.getTicketId())
                                .subject(ticket.getSubject())
                                .description(ticket.getDescription())
                                .category(ticket.getCategory())
                                .priority(ticket.getPriority())
                                .status(ticket.getStatus())
                                .createdAt(ticket.getCreatedAt())
                                .build())
                .toList();
    }
}
