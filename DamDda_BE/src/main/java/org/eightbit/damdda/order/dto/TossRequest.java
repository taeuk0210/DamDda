package org.eightbit.damdda.order.dto;

import lombok.Data;

@Data
public class TossRequest {

    private String paymentKey;
    private String orderId;
    private String amount;

}
