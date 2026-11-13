package com.artvista.backend.dto;

import com.artvista.backend.entity.Artwork;
import lombok.Data;

import java.util.List;

@Data
public class ArtistProfileDTO {
    private Long artistId;
    private String artistName;

    private String category;
    private String experience;
    private String location;

    private String portfolioUrl;
    private String portfolioSize;


    private String instagram;
    private String artStation;
    private String additionalLink;

    private String artistBio;
    private String profilePicture;

    private boolean approved = false;

    private List<Artwork> artworks;

}
