package com.artvista.backend.dto;

import lombok.Data;

@Data
public class PaymentVerificationRequest {
    private String razorpay_order_id;
    private String razorpay_payment_id;
    private String razorpay_signature;
    private String exhibitionId;
    private Integer quantity;
    private Double totalAmount;
    private String visitDate;
}
