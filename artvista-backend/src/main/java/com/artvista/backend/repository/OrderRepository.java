package com.artvista.backend.repository;

import com.artvista.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Long> {
    Optional<Order> findOrderById(Long orderId);
    List<Order> findByUserId(Long userId);
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status IN ('SUCCESS', 'DELIVERED')")
    Double getTotalRevenue();

    @Query("SELECT MONTHNAME(o.createdAt), SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED' GROUP BY MONTH(o.createdAt), MONTHNAME(o.createdAt) ORDER BY MONTH(o.createdAt)")
    List<Object[]> getMonthlyRevenueRaw();

    @Query("""
    SELECT SUM(o.totalAmount)
    FROM Order o
    WHERE o.artistId = :artistId
    """)
        Double getTotalSales(Long artistId);

    @Query("""
    SELECT COUNT(o)
    FROM Order o
    WHERE o.artistId = :artistId
    AND o.status != 'DELIVERED'
        """)
        Long getPendingOrders(Long artistId);

    @Query("SELECT o FROM Order o WHERE o.artistId = :artistId")
    List<Order> findByArtistId(@Param("artistId") Long artistId);

    @Query("""
        SELECT
        MONTH(o.createdAt),
        SUM(o.totalAmount)
        FROM Order o
        WHERE o.artistId = :artistId
        GROUP BY MONTH(o.createdAt)
        ORDER BY MONTH(o.createdAt)
    """)
    List<Object[]> getMonthlySales(@Param("artistId") Long artistId);

    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    Long countByStatus(String completed);
}
