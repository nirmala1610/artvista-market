package com.artvista.backend.repository;

import com.artvista.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Long> {
    @Query("""
        SELECT COALESCE(SUM(b.quantity),0)
        FROM Booking b
        WHERE b.exhibitionId = :exhibitionId
        AND b.visitDate = :visitDate
        AND b.status='SUCCESS'
    """)
    Integer getBookedTicketsForDay(
            @Param("exhibitionId") String exhibitionId,
            @Param("visitDate") LocalDate visitDate
    );
}
