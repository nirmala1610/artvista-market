package com.artvista.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TicketResponse {

    private Long id;

    private String ticketId;

    private String subject;

    private String description;

    private String category;

    private String priority;

    private String status;

    private LocalDateTime createdAt;
}