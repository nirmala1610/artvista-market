package com.artvista.backend.dto;

import lombok.Data;

@Data
public class ApplicationDTO {
    private Long pending;
    private Long total;
    private Long rejected;
}
