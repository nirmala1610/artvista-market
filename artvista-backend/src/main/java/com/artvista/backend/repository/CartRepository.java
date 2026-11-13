package com.artvista.backend.repository;

import com.artvista.backend.entity.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CartRepository extends MongoRepository<Cart,String> {
    Optional<Cart> findByUserId(Long userId);
}
