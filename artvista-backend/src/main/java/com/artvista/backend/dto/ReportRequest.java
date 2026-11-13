package com.artvista.backend.dto;

import lombok.Data;

@Data
public class ReportRequest {
    private String artworkId;
    private String reason;
    private String description;
    private String evidence;
}