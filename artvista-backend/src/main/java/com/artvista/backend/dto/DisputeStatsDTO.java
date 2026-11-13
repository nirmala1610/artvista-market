package com.artvista.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DisputeStatsDTO {
    private long openCases;
    private long resolvedCases;
    private long highRiskCases;
    private double refundAmount;
}
