package com.artvista.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class ArtistRequest {
    @NotBlank
    private  String fullName;
    @NotBlank
    private String artistName;
    @NotBlank
    private String category;
    @NotBlank
    private String experience;
    @NotBlank
    private String location;
    private String portfolioUrl;
    @NotBlank
    private String portfolioSize;
    private String instagram;
    private String artStation;
    private String additionalLink;
    @NotBlank
    private String artistBio;
    private String profilePicture;
    @NotEmpty
    private List<String> sampleArtworks;

    private String status;
}
