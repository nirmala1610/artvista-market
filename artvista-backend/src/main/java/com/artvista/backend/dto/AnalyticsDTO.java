package com.artvista.backend.dto;

import lombok.Data;

@Data
public class AnalyticsDTO {
    private  String getExhibitionTitle;
    private  long getTicketsSold;
    private double getRevenue;
}
