package com.artvista.backend.repository;

import com.artvista.backend.entity.ArtistLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtistLogReposirory extends JpaRepository<ArtistLog,Long> {

    List<ArtistLog> findByArtistId(Long id);
}
