package com.artvista.backend.repository;

import com.artvista.backend.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository
        extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findTop5ByOrderByCreatedAtDesc();
}