package org.eightbit.damdda.project.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DailySupporting {
    private LocalDateTime supportedAt;
    private Integer totalPrice;
}
