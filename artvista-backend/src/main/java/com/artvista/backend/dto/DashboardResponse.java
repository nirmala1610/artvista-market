package com.artvista.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class DashboardResponse {
    private Long totalUsers;
    private Long totalArtists;
    private Long totalArtworks;
    private Double totalRevenue;

    private List<MonthlyRevenueDTO> revenueAnalytics;

    private List<CategoryDTO> artworkCategories;

    private List<ActivityDTO> recentActivities;
}
