package com.artvista.backend.repository;

import com.artvista.backend.entity.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeRepository
        extends JpaRepository<Dispute, Long> {

    Long countByStatus(String open);
    List<Dispute> findByUserId(Long id);

    long countByPriorityLevel(String level);

    @Query("SELECT COALESCE(SUM(d.refundAmount),0) FROM Dispute d")
    Double getTotalRefund();
}
