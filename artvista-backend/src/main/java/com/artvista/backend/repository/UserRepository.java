package com.artvista.backend.repository;

import com.artvista.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User>  findByEmail(String email);

    Long countByRole(String role);
    @Query("SELECT COUNT(u) FROM User u WHERE u.joinedAt >= :date")
    Long countNewUsers(@Param("date") LocalDateTime date);
}
