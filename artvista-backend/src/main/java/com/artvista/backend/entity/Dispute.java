package com.artvista.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "disputes")
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;

    private Long userId;

    private String artworkTitle;
    private String artistName;

    @Column(nullable = false)
    private String reason;
    private String priorityLevel;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private String evidence;

    private String status;

    private LocalDateTime createdAt;

    private Double refundAmount;
}
