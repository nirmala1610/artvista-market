package com.artvista.backend.dto;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class CategoryDTO {
    @Field("_id")
    private String category;
    private Long count;

    public CategoryDTO(String category, Long count) {
        this.category = category;
        this.count = count;
    }
}
