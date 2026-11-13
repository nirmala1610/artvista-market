package com.artvista.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "curators")
public class Curator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String fullName;
    @Column(nullable = false)
    private Long userId;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String phone;
    private String profilePhoto;

    @Column(columnDefinition = "TEXT")
    private String currentRole;

    @Column(columnDefinition = "TEXT")
    private List<String> specializations;

    @Column(nullable = false)
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String portfolioUrl;
    @Column(columnDefinition = "TEXT")
    private String instagram;
    @Column(columnDefinition = "TEXT")
    private String behance;
    @Column(columnDefinition = "TEXT")
    private String linkedin;

    @Column(columnDefinition = "TEXT")
    private String motivation;
    @Column(columnDefinition = "TEXT")
    private String curationStyle;

    private List<String> skills;

    @Column(nullable = false,columnDefinition = "TEXT")
    private String resumeUrl;
    @Column(columnDefinition = "TEXT")
    private String portfolioPdfUrl;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;
    private LocalDateTime since;
}
