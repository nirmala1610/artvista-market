package com.artvista.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String exhibitionId;
    private Long userId;
    private Integer quantity;

    private LocalDate visitDate;

    private Double totalAmount;
    private String paymentId;
    private String orderId;
    private String status;
}
