package com.artvista.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActivityDTO {
    private String message;
    private LocalDateTime createdAt;

    public ActivityDTO(
            String message,
            LocalDateTime createdAt
    ) {
        this.message = message;
        this.createdAt = createdAt;
    }

}
