package org.eightbit.damdda.order.service;

import org.eightbit.damdda.order.dto.TossResponse;

public interface TossPayService {
    TossResponse confirmPayment(String paymentKey, String orderId, String amount);
}
