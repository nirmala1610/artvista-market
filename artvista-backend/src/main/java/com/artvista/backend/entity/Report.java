package com.artvista.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "artwork_reports")
@Data
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Transient
    private String reportId;

    private Long userId;

    @Column(nullable = false)
    private String artworkId;

    private String artworkTitle;
    private String artistName;

    @Column(nullable = false)
    private String reason;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private String evidence;

    private String status;

    private LocalDateTime createdAt;
}
