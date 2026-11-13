package com.artvista.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ArtworkUpdateDTO {
    @NotBlank
    private String title;
    @NotBlank
    private String category;
    @NotBlank
    private String imageUrl;
    @NotNull
    private Double price;
    @NotNull
    private Integer edition;
    @NotBlank
    private String year;

    private String medium;
    private String orientation;
    private String style;
    private String subject;
    private String material;

    @NotNull
    private Double height;
    @NotNull
    private Double width;
    private Double depth;

    @NotBlank
    private String description;
}
