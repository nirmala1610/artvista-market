package com.artvista.backend.repository;

import com.artvista.backend.entity.CuratorApplication;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CuratorApplicationRepository extends MongoRepository<CuratorApplication,String> {
    long countByApproved(String status);
}
