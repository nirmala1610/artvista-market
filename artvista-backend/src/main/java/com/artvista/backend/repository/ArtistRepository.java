package com.artvista.backend.repository;

import com.artvista.backend.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist,Long> {

    Artist findByUserId(Long id);

    Optional<Artist> findByEmail(String email);

    List<Artist> findByFeatured(boolean featured);

    List<Artist> findByArtistNameIn(List<String> selectedArtistNames);
}
