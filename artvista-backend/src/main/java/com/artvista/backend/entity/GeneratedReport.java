package com.artvista.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class GeneratedReport {

    @Id
    private Long id;

    private String title;

    private String category;

    private String generatedBy;

    private String status;

    private String fileUrl;

    private LocalDateTime generatedAt;
}
