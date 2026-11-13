package com.artvista.backend.service;

import com.artvista.backend.dto.ArtworkFilterDTO;
import com.artvista.backend.entity.Artwork;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ArtworkService {

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Artwork> filterArtworks(ArtworkFilterDTO dto) {

        Query query = new Query();

        List<Criteria> criteriaList = new ArrayList<>();

        // CATEGORY
        if (dto.getCategories() != null &&
                !dto.getCategories().isEmpty()) {

            criteriaList.add(
                    Criteria.where("category")
                            .in(dto.getCategories())
            );
        }

        // MEDIUM
        if (dto.getMediums() != null &&
                !dto.getMediums().isEmpty()) {

            criteriaList.add(
                    Criteria.where("medium")
                            .in(dto.getMediums())
            );
        }

        // ORIENTATION
        if (dto.getOrientations() != null &&
                !dto.getOrientations().isEmpty()) {

            criteriaList.add(
                    Criteria.where("orientation")
                            .in(dto.getOrientations())
            );
        }

        // PRICE
        if (dto.getMinPrice() != null ||
                dto.getMaxPrice() != null) {

            Criteria priceCriteria =
                    Criteria.where("price");

            if (dto.getMinPrice() != null) {
                priceCriteria.gte(dto.getMinPrice());
            }

            if (dto.getMaxPrice() != null) {
                priceCriteria.lte(dto.getMaxPrice());
            }

            criteriaList.add(priceCriteria);
        }

        // APPLY CRITERIA
        if (!criteriaList.isEmpty()) {

            query.addCriteria(
                    new Criteria().andOperator(
                            criteriaList.toArray(new Criteria[0])
                    )
            );
        }

        // SORTING
        if ("priceLow".equals(dto.getSortBy())) {

            query.with(
                    Sort.by(Sort.Direction.ASC, "price")
            );

        } else if ("priceHigh".equals(dto.getSortBy())) {

            query.with(
                    Sort.by(Sort.Direction.DESC, "price")
            );

        } else if ("newest".equals(dto.getSortBy())) {

            query.with(
                    Sort.by(Sort.Direction.DESC, "year")
            );
        }else if ("artist".equals(dto.getSortBy())) {

            query.with(
                    Sort.by(Sort.Direction.ASC, "artist")
            );
        }

        return mongoTemplate.find(
                query,
                Artwork.class
        );
    }
}