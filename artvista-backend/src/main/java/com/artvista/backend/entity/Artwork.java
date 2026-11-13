package com.artvista.backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "artworks")
@Getter
@Setter
public class Artwork {
    @Id
    private String id;


    private String title;
    private String category;
    private String imageUrl;
    private Long artistId;
    private String artistName;
    private Double price;
    private Integer edition;
    private String year;
    private String medium;
    private String orientation;
    private String style;
    private String subject;
    private String material;
    private Double height;
    private Double width;
    private  Double depth;

    private String description;
    private Boolean featured = false;
}
