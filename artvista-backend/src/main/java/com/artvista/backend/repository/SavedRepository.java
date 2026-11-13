package com.artvista.backend.repository;

import com.artvista.backend.entity.Saved;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SavedRepository extends MongoRepository<Saved,String> {
    Optional<Saved> findByUserId(Long id);
}
