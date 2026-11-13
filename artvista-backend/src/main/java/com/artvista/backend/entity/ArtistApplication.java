package com.artvista.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "artist_application")
public class ArtistApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;

    private  String fullName;
    private String email;
    private String artistName;

    private String category;

    private String experience;
    private String location;

    @Column(columnDefinition = "TEXT")
    private String portfolioUrl;
    private String portfolioSize;

    @Column(columnDefinition = "TEXT")
    private String instagram;
    @Column(columnDefinition = "TEXT")
    private String artStation;
    @Column(columnDefinition = "TEXT")
    private String additionalLink;

    @Column(columnDefinition = "TEXT")
    private String artistBio;

    private String profilePicture;

    private List<String> sampleArtworks;
    private String status;

}
