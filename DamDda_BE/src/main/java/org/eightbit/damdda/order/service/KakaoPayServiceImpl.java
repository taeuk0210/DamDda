package org.eightbit.damdda.order.service;

import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.order.dto.KakaoApproveResponse;
import org.eightbit.damdda.order.dto.KakaoReadyResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class KakaoPayServiceImpl implements KakaoPayService {

    static final String cid = "TC0ONETIME"; // 가맹점 테스트 코드
    @Value("${KAKAO_ADMIN_KEY}")
    private String KAKAO_ADMIN_KEY;
    private KakaoReadyResponse kakaoReady;
    @Value("${server.backend.base-url}")
    private String backendBaseUrl;
    // 결제 준비
    @Override
    public KakaoReadyResponse kakaoPayReady(Long orderId) {

        // 카카오페이 요청 양식
        MultiValueMap<String, Object> parameters = new LinkedMultiValueMap<>();
        parameters.add("cid", cid);
        parameters.add("partner_order_id", orderId); // 전달받은 orderId를 사용
        parameters.add("partner_user_id", 0);
        parameters.add("item_name", "쿠폰");
        parameters.add("quantity", 1);
        parameters.add("total_amount", 10000);
        parameters.add("vat_amount", 100);
        parameters.add("tax_free_amount", 0);
        parameters.add("approval_url", String.format(backendBaseUrl+"/damdda/payment/kakao/success/%d", orderId));
        parameters.add("cancel_url", String.format(backendBaseUrl+"/damdda/payment/kakao/cancel?orderId=%d", orderId));
        parameters.add("fail_url", String.format(backendBaseUrl+"/damdda/payment/kakao/fail?orderId=%d", orderId));

        // 파라미터, 헤더
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(parameters, this.getHeaders());

        // 외부에 보낼 url
        RestTemplate restTemplate = new RestTemplate();

        kakaoReady = restTemplate.postForObject(
                "https://kapi.kakao.com/v1/payment/ready",
                requestEntity,
                KakaoReadyResponse.class);

        return kakaoReady;
    }

    // 결제 승인
    @Override
    public KakaoApproveResponse approveResponse(String pgToken, Long orderId) {
        MultiValueMap<String, Object> parameters = new LinkedMultiValueMap<>();
        parameters.add("cid", cid);
        parameters.add("tid", kakaoReady.getTid());
        parameters.add("partner_order_id", orderId); // 전달받은 orderId 사용
        parameters.add("partner_user_id", 0);
        parameters.add("pg_token", pgToken);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(parameters, this.getHeaders());

        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.postForObject(
                "https://kapi.kakao.com/v1/payment/approve",
                requestEntity,
                KakaoApproveResponse.class);
    }

    /**
     * 카카오 요구 헤더값
     */
    private HttpHeaders getHeaders() {
        HttpHeaders httpHeaders = new HttpHeaders();

        String auth = "KakaoAK " + KAKAO_ADMIN_KEY;
        httpHeaders.set("Authorization", auth);
        httpHeaders.set("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        return httpHeaders;
    }
}