package com.artvista.backend.repository;

import com.artvista.backend.entity.ArtistApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ArtistApplicationRepository  extends JpaRepository<ArtistApplication,Long> {

    Long countByStatus(String status);
    Page<ArtistApplication> findByArtistNameContainingIgnoreCase(
            String artistName,
            Pageable pageable
    );

    Page<ArtistApplication> findByStatus(
            String status,
            Pageable pageable
    );

    Page<ArtistApplication> findByArtistNameContainingIgnoreCaseAndStatus(
            String artistName,
            String status,
            Pageable pageable
    );

    boolean existsByEmail(String email);
}
