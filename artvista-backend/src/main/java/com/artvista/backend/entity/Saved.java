package com.artvista.backend.entity;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "saved")
@Data
public class Saved {
    @Id
    private String id;

    private Long userId;
    private List<String> artworkIds;
}
