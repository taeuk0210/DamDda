package org.eightbit.damdda.order.dto;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@ToString
public class PaymentRewardDTO {
    private String rewardName;
    private String selectOption;
}