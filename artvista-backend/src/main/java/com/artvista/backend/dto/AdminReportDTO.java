package com.artvista.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminReportDTO {
    private Long totalUsers;
    private Long totalArtists;
    private Long totalArtworks;
    private Double totalRevenue;
    private Long completedOrders;
    private Long pendingOrders;
    private Long totalDisputes;
    private Long pendingDisputes;
    private Double refundAmount;

    public AdminReportDTO() {

    }
}
