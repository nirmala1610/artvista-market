package com.artvista.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlySalesDTO {
    private String month;
    private Double sales;
}
