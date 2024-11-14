package org.eightbit.damdda.order.dto;

import lombok.Data;

@Data
public class TossResponse {
    private String status;
    private String orderId;
    private String paymentKey;
    private String approvedAt;
    private String method;

}
