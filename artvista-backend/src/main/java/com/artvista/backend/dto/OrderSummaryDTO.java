package com.artvista.backend.dto;

import lombok.Data;

@Data
public class OrderSummaryDTO {
    private Long orderId;
    private String artworkTitle;
    private String artworkImage;
    private String buyerName;
    private double price;
    private String status;
}
