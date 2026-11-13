package com.artvista.backend.dto;

import lombok.Data;

@Data
public class TicketRequest {

    private String subject;
    private String description;
    private String category;
    private String priority;
}