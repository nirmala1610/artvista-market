package com.artvista.backend.dto;

import lombok.Data;

@Data
public class MonthlyRevenueDTO {
    private String month;
    private Double revenue;

    public MonthlyRevenueDTO(String month, Double revenue) {
        this.month = month;
        this.revenue = revenue;
    }

}
