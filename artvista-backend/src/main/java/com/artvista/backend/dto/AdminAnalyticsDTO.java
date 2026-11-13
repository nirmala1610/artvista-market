package com.artvista.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminAnalyticsDTO {

    private Long totalUsers;
    private Long totalArtists;
    private Long totalArtworks;
    private Long totalOrders;

    private Double totalRevenue;

    private Long activeDisputes;
    private Long resolvedDisputes;

    private Double monthlyGrowth;
    private List<WeeklyPerformanceDTO> weekly;
}