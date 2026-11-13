package com.artvista.backend.dto;

import lombok.Data;

@Data
public class ArtistDetailsDTO {
    private Long artistId;
    private String artistName;
    private String category;
    private String portfolioSize;
    private String profilePicture;
    private String location;
    private String status;
}
