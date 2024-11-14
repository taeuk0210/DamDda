package org.eightbit.damdda.generativeai.service;

import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.generativeai.client.AIContentGenerationClient;
import org.eightbit.damdda.generativeai.dto.AIProjectDescriptionDTO;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@Log4j2
public class GenerativeAIServiceImpl implements GenerativeAIService {

    private final AIContentGenerationClient aiContentGenerationClient;

    public GenerativeAIServiceImpl(AIContentGenerationClient aiContentGenerationClient) {
        this.aiContentGenerationClient = aiContentGenerationClient;
    }

    @Override
    public Mono<String> generateProjectDescription(AIProjectDescriptionDTO aiProjectDescriptionDTO) {
        String requestBody = String.format(
                "{\"title\":\"%s\",\"category\":\"%s\",\"tags\":[\"%s\"],\"description\":\"%s\"}",
                aiProjectDescriptionDTO.getTitle(),
                aiProjectDescriptionDTO.getCategory(),
                String.join("\",\"", aiProjectDescriptionDTO.getTags()),
                aiProjectDescriptionDTO.getDescription()
        );

        log.debug("[generativeai] Generated request body for AI API: {}", requestBody);

        return aiContentGenerationClient.requestProjectDescription(requestBody)
                .onErrorResume(e -> {
                    log.error("[generativeai] Error while generating project description: {}", e.getMessage(), e);
                    return Mono.error(new RuntimeException("Failed to generate project description", e));
                });
    }
}
