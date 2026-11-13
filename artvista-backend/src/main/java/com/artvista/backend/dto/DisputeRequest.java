package com.artvista.backend.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class DisputeRequest {
    private Long orderId;
    private String priorityLevel;
    private String reason;
    private String description;
    private String evidence;
}
