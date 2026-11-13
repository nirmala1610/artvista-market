package com.artvista.backend.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItem {
    private String artworkId;
    private String title;
    private String imageUrl;
    private String category;
    private String orientation;
    private Integer edition;
    private String year;
    private Double price;
}
