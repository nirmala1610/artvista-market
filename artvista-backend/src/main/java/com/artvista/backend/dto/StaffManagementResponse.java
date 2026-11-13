package com.artvista.backend.dto;

import com.artvista.backend.entity.CuratorApplication;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class StaffManagementResponse {
    private CuratorStatsDTO stats;

    private List<CuratorApplication> applications;
}
