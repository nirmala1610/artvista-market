package com.artvista.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
@Getter
@Setter
public class Cart {
    @Id
    private String id;

    private Long userId;
    private List<CartItem> items = new ArrayList<>();
}
