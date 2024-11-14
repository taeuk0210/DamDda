package org.eightbit.damdda.order.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.order.dto.KakaoApproveResponse;
import org.eightbit.damdda.order.dto.KakaoReadyResponse;
import org.eightbit.damdda.order.dto.TossResponse;
import org.eightbit.damdda.order.service.KakaoPayService;
import org.eightbit.damdda.order.service.TossPayService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@Log4j2
public class PaymentController {

    private final KakaoPayService kakaoPayService;
    private final TossPayService tossPayService;

    @Value("${server.client.base-url}")
    private String clientBaseUrl;

    @GetMapping("/toss/success")
    public ResponseEntity<TossResponse> tossSuccess(
            @RequestParam("paymentKey") String paymentKey,
            @RequestParam("orderId") String orderId,
            @RequestParam("amount") String amount,
            HttpServletResponse response) {
        // Toss 결제 승인 처리
        TossResponse tossResponse = tossPayService.confirmPayment(paymentKey, orderId, amount);
        // 결제 성공 여부 확인
        try {
            if (tossResponse.getStatus().equals("DONE")) {
                String orderIdNew = orderId.replace("DAMDDA-ORDER-", "");
                // 결제 성공 시 /toss/success/getOrder로 리다이렉트
                response.sendRedirect(clientBaseUrl+"/payment/success?orderId=" + Long.parseLong(orderIdNew));
            } else {
                // 결제 실패 시 /toss/success/getOrder로 실패 ID 1로 리다이렉트
                response.sendRedirect(clientBaseUrl+"/payment/success?orderId=" + orderId);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(tossResponse);
    }

    @PostMapping("/kakao/ready")
    public ResponseEntity<KakaoReadyResponse> readyToKakaoPay(@RequestBody Map<String, Object> requestData) {
        Long orderId = Long.parseLong(requestData.get("orderId").toString());
        KakaoReadyResponse kakaoReadyResponse = kakaoPayService.kakaoPayReady(orderId);
        return ResponseEntity.ok(kakaoReadyResponse);
    }

    // 결제 성공 시 승인 요청
    @GetMapping("/kakao/success/{order_id}")
    public ResponseEntity<KakaoApproveResponse> afterPayRequest(
            @RequestParam("pg_token") String pgToken,
            @PathVariable("order_id") Long orderId,  // PathVariable로 order_id 받음
            HttpServletResponse response) {
        // pg_token과 orderId를 사용하여 결제 승인 요청
        KakaoApproveResponse kakaoApproveResponse = kakaoPayService.approveResponse(pgToken, orderId);
        // 결제 성공 시 React의 결제 완료 페이지로 리다이렉트
        try {
            response.sendRedirect(clientBaseUrl+"/payment/success?orderId=" + orderId);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(kakaoApproveResponse);
    }

}
