package com.artvista.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "artists")
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;

    @Column(nullable = false)
    private  String fullName;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String artistName;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String experience;
    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String portfolioUrl;
    @Column(nullable = false)
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

    private boolean approved = false;

    @ElementCollection
    @Column(nullable = false)
    private List<String> artworkIds;

    private String status;
    private boolean featured;
}
