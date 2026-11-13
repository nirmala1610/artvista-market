package com.artvista.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ReportDTO {
    private String generatedBy;
    private String date;
    private Double totalRevenue;
    private Long totalUsers;
    private Long totalArtworks;
    private Long activeDisputes;

    private List<Integer> weeklyRevenue;

    public ReportDTO() {

    }
}
