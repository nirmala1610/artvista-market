package com.artvista.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CuratorApplicationDTO {

    @NotBlank
    private String fullName;
    @NotBlank
    private String phone;

    private String currentRole;


    @NotEmpty
    private List<String> specializations;

    @NotBlank
    private String experience;

    private String portfolioUrl;
    private String instagram;
    private String behance;
    private String linkedin;

    private String motivation;
    private String curationStyle;

    @NotEmpty
    private List<String> skills;
    @NotBlank
    private String resumeUrl;
    private String portfolioPdfUrl;

    private String additionalNotes;
}
