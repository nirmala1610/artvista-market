package com.artvista.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ExhibitionRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String themeName;

    @NotBlank
    private String category;

    @NotBlank
    private String description;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotBlank
    private String openTime;

    @NotBlank
    private String closeTime;

    @NotBlank
    private String visibility;

    @NotBlank
    private String status;

    @NotNull
    private Boolean isPaid;

    private Double ticketPrice;
    private Double vipPrice;
    private Integer maxVisitors;
    private String bannerUrl;
    private String location;

    @NotEmpty
    private List<Long> selectedArtists;
}
