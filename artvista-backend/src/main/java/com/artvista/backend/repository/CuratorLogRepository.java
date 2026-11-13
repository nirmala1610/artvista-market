package com.artvista.backend.repository;

import com.artvista.backend.entity.CuratorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface CuratorLogRepository extends JpaRepository<CuratorLog, Long> {
    List<CuratorLog> findTop3ByOrderByCreatedAtDesc();

    @Query(value = "SELECT HOUR(created_at) as hour, COUNT(*) as count FROM curator_logs GROUP BY HOUR(created_at) ORDER BY hour", nativeQuery = true)
    List<Map<String, Object>> getHourlyActivityDistribution();
}
