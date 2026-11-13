package com.artvista.backend.repository;

import com.artvista.backend.dto.CategoryDTO;
import com.artvista.backend.entity.Artwork;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ArtworkRepository extends MongoRepository<Artwork,String> {

    Optional<Artwork> findById(String id);
    List<Artwork> findByArtistId(Long id);
    List<Artwork> findByPriceLessThanEqual(double price);
    List<Artwork> findByTitleContainingIgnoreCase(String keyword);
    List<Artwork> findByCategory(String category);
    List<Artwork> findByMedium(String medium);
    List<Artwork> findByOrientation(String orientation);


    @Aggregation(pipeline = {
            "{ $match: { category: { $ne: null } } }",
            "{ $group: { _id: '$category', count: { $sum: 1 } } }"
    })
    List<CategoryDTO> getCategoryList();

    long countByArtistId(Long artistId);

    Optional<Artwork> findByIdContaining(String artworkId);

    long countByCategory(String category);

    List<Artwork> findByFeatured(boolean value);


}
