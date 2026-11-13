package com.artvista.backend.repository;

import com.artvista.backend.entity.Curator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CuratorRepository extends JpaRepository<Curator,Long> {
}
