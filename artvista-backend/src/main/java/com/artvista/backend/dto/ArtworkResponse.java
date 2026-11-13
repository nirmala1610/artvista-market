package com.artvista.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArtworkResponse {
    private String title;
    private String category;
    private String imageUrl;
    private String orientation;
    private Integer edition;
    private String year;
}