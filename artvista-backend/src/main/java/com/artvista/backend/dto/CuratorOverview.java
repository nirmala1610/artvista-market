package com.artvista.backend.dto;

import com.artvista.backend.entity.CuratorLog;
import lombok.Data;

import java.util.List;

@Data
public class CuratorOverview {
    private long totalVisitors;
    private long activeExhibitions;
    private String trendingCollection;
    private List<CuratorLog> liveActivities;
    private List<AnalyticsDTO> analytics;
}
