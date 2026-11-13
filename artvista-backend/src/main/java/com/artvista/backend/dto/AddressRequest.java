package com.artvista.backend.dto;

import lombok.Data;

@Data
public class AddressRequest {
    private String firstName;
    private String lastName;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String zipcode;
    private String phoneNumber;
    private String email;
    private boolean isDefault;
}
