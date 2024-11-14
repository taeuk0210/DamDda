package org.eightbit.damdda.order.service;

import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.order.dto.TossRequest;
import org.eightbit.damdda.order.dto.TossResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TossPayServiceImpl implements TossPayService {

    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${TOSS_SECRET_KEY}")
    private String TOSS_SECRET_KEY;

    @Override
    public TossResponse confirmPayment(String paymentKey, String orderId, String amount) {
        // Toss Payments 결제 승인 API 호출
        String tossApiUrl = "https://api.tosspayments.com/v1/payments/confirm";

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(TOSS_SECRET_KEY, "");
        headers.add("Content-Type", "application/json");

        // 요청 DTO 생성
        TossRequest requestDTO = new TossRequest();
        requestDTO.setPaymentKey(paymentKey);
        requestDTO.setOrderId(orderId);
        requestDTO.setAmount(amount);

        // HTTP 요청 객체
        HttpEntity<TossRequest> requestEntity = new HttpEntity<>(requestDTO, headers);

        // Toss API로 요청 전송
        ResponseEntity<TossResponse> tossResponse = restTemplate.exchange(
                tossApiUrl,
                HttpMethod.POST,
                requestEntity,
                TossResponse.class
        );
        return tossResponse.getBody();
    }
}