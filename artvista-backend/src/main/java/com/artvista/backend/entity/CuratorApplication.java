package com.artvista.backend.entity;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "curator_applications")
@Data
public class CuratorApplication {
    @Id
    private String id;

    private String fullName;
    private Long userId;
    private String email;
    private String phone;
    private String profilePhoto;

    private String currentRole;

    private List<String> specializations;

    private String experience;

    private String portfolioUrl;
    private String instagram;
    private String behance;
    private String linkedin;

    private String motivation;
    private String curationStyle;

    private List<String> skills;

    private String resumeUrl;
    private String portfolioPdfUrl;

    private String additionalNotes;

    private String approved;

    private LocalDateTime createdAt = LocalDateTime.now();
}
