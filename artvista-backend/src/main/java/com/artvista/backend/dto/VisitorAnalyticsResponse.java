package com.artvista.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class VisitorAnalyticsResponse {
    private String totalVisitors;
    private String visitorGrowth;
    private String avgSessionTime;
    private String mostViewedCategory;
    private String categoryGrowth;
    private String conversionRate;
    private List<ArtworkResponse> topArtworks;
    private List<Map<String, Object>> hourlyTraffic;
    private List<Map<String, Object>> heatmapZones;
}
