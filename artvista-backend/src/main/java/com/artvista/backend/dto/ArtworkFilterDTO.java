package com.artvista.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class ArtworkFilterDTO {

    private List<String> categories;
    private List<String> mediums;
    private List<String> orientations;

    private Double minPrice;
    private Double maxPrice;

    private String sortBy;
}
