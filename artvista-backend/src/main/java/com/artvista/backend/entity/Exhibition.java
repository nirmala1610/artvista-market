package com.artvista.backend.entity;

import com.artvista.backend.dto.ExhibitionArtwork;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "exhibitions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Exhibition {
    @Id
    private String id;

    private String title;
    private String themeName;
    private String category;
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;
    private String openTime;
    private String closeTime;

    private String visibility;
    private String status;

    private Boolean isPaid;
    private Double ticketPrice;
    private Double vipPrice;
    private Integer maxVisitors;

    private String bannerUrl;
    private List<Long> selectedArtists;

    private Integer views;
    private Integer ticketsSold;
    private Double revenue;

    private LocalDateTime createdAt;
    private List<ExhibitionArtwork> artworks = new ArrayList<>();
    @Column(columnDefinition = "TEXT")
    private String location;
}
