package com.artvista.backend.dto;

import lombok.Data;

@Data
public class ArtistMetadataResponse {
    private String username;

    private String bio;

    private String profileImage;

    private int artworksCount;

    private double totalSales;

    private int orders;
}
