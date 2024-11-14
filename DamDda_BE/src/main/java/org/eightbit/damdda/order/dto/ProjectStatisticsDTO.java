package org.eightbit.damdda.order.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
public class ProjectStatisticsDTO {

    private Long currentFundingReceived;            // 현재 총 후원 금액

    private Long targetFundingGoal;                 // 목표 후원 금액

    private Long currentSupportersCount;            // 후원자 수

    private Long daysRemaining;                     // 남은 기간

    private LocalDate projectStartDate;             // 프로젝트 시작일

    private LocalDate projectEndDate;               // 프로제트 종료일

    private Map<LocalDate, Long> dailyFundings;     // 일별 후원 금액

}
