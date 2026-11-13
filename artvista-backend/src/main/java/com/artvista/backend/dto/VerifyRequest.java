package com.artvista.backend.dto;

import lombok.Data;

@Data
public class VerifyRequest {
    private String email;
    private String password;
    private String otp;
}
