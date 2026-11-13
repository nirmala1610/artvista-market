package com.artvista.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CuratorStatsDTO {
    private long totalApplications;
    private long approvedApplications;
    private long pendingApplications;
    private long rejectedApplications;
}