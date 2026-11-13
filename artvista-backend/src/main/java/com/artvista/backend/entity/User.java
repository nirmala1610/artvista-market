package com.artvista.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    private String role;
    private String image;

    private String phone;
    private String country;

    private String isArtist;
    private String isCurater;

    private LocalDateTime joinedAt;

    private boolean verified;
}
