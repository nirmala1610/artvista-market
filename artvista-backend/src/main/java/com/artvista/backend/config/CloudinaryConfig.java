package com.artvista.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    Cloudinary cloudinary() {
       return new Cloudinary(Map.of(
               "cloud_name","dxd1wajan",
               "api_key","133174263817466",
               "api_secret","_SpHS90WzvfU3H132ZdiRBVzxsE"
       ));
    }
}
