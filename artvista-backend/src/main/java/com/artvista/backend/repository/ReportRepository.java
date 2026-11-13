package com.artvista.backend.repository;

import com.artvista.backend.entity.GeneratedReport;
import com.artvista.backend.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report,Long> {
    List<Report> findAllByOrderByCreatedAtDesc();
}
