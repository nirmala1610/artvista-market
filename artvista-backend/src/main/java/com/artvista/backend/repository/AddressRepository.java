package com.artvista.backend.repository;

import com.artvista.backend.entity.Address;
import com.artvista.backend.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address,Long> {
    Optional<Address> findByUserIdAndIsDefaultTrue(Long userId);
    @Transactional
    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.userId = :userId")
    void updateAllDefaultsToFalse(@Param("userId") Long userId);

    List<Address> findByUserId(Long userId);

    Optional<Address> findByIdAndUserId(Long id, Long id1);
}
