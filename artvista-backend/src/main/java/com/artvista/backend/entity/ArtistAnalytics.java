package com.artvista.backend.entity;

import com.artvista.backend.dto.MonthlyRevenueDTO;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@Document(collection = "artist_analytics")
public class ArtistAnalytics {
    @Id
    private String id;

    @Field("artistId")
    private Integer artistId;

    @Field("bestMonth")
    private String bestMonth;

    @Field("growthPercentage")
    private Integer growthPercentage;

    @Field("monthlyRevenue")
    private List<MonthlyRevenueDTO> monthlyRevenue;
}
