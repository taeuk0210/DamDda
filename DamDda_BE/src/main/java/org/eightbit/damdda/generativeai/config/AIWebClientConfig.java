package org.eightbit.damdda.generativeai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AIWebClientConfig {

    // application.properties에서 값 주입
    @Value("${server.ai-python.base-url}")
    private String aiPythonBaseUrl;

    /**
     * webClient: WebClient 인스턴스를 생성하는 메서드
     *
     * @return WebClient 외부 API와 비동기 통신을 위한 WebClient 인스턴스 반환
     */
    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                // 주입된 URL을 사용하여 기본 URL 설정
                .baseUrl(aiPythonBaseUrl)
                .build();
    }
}
