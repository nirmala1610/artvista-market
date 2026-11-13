package com.artvista.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AllOrderResponse {
    private Long orderId;
    private List<ArtworkResponse> artworks;
    private double totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private String trackingId;
}


