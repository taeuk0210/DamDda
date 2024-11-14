package org.eightbit.damdda.generativeai.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Log4j2
public class AIContentGenerationClient {

    // WebClient 인스턴스, 외부 API와 통신을 담당
    private final WebClient webClient;

    /**
     * requestProjectDescription: 외부 API에 프로젝트 설명을 요청하는 메소드
     *
     * @param requestBody 요청 본문(JSON 형식의 문자열)
     * @return Mono<String> API 응답 (비동기 처리)
     */
    public Mono<String> requestProjectDescription(String requestBody) {
        return webClient.post() // POST 요청 생성
                .uri("/api/generative-ai/project-description") // API 엔드포인트 지정
                .header("Content-Type", "application/json; charset=utf-8") // 요청 헤더 설정
                .bodyValue(requestBody) // 요청 본문 설정
                .retrieve() // API 응답을 받아오는 작업 수행
                .bodyToMono(String.class) // 응답을 Mono<String> 타입으로 변환
                // 성공적으로 응답을 받았을 때, 응답을 로깅
                .doOnNext(response -> log.info("[generativeai] API response: {}", response))
                // API 호출 중 발생한 모든 오류를 로깅
                .doOnError(error -> log.error("[generativeai] Error occurred during API call", error))
                // WebClientResponseException(HTTP 오류 상태) 발생 시 처리
                .onErrorMap(WebClientResponseException.class, ex -> {
                    // 오류 상태 코드와 응답 본문을 로깅
                    log.error("[generativeai] WebClientResponseException: Status {}, Body {}", ex.getStatusCode(), ex.getResponseBodyAsString());
                    // 예외를 새로운 RuntimeException으로 변환하여 상위로 전달
                    return new RuntimeException("Error during external API call", ex);
                })
                // 그 외의 예외 발생 시 처리
                .onErrorMap(Exception.class, ex -> {
                    // 예상치 못한 오류를 로깅
                    log.error("[generativeai] Unexpected error occurred", ex);
                    // 예외를 RuntimeException으로 변환하여 상위로 전달
                    return new RuntimeException("Unexpected error during API call", ex);
                });
    }
}
