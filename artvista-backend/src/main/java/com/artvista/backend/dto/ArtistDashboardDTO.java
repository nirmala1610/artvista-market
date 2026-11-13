package com.artvista.backend.dto;

import com.artvista.backend.entity.ArtistLog;
import lombok.Data;

import java.util.List;

@Data
public class ArtistDashboardDTO {

    private Long artistId;

    private String artistName;
    private String profilePicture;
    private String category;

    private long totalArtworks;
    private double totalSales;
    private long totalOrders;
    private long pendingOrders;

    private String bestMonth;
    private int growthPercentage;

    private List<TopArtworkDTO> topSellingArtworks;
    private List<TopBuyerDTO> topBuyers;
    private List<ArtistLog> recentActivities;
    private List<MonthlySalesDTO> monthlySales;

    private List<OrderSummaryDTO> orders;
}
