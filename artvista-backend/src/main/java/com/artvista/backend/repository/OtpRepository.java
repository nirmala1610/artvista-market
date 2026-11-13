package com.artvista.backend.repository;

import com.artvista.backend.entity.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<EmailOtp,Long> {

    Optional<EmailOtp> findByEmail(String email);

}
