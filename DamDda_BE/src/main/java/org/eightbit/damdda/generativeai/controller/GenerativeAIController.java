package org.eightbit.damdda.generativeai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.generativeai.dto.AIProjectDescriptionDTO;
import org.eightbit.damdda.generativeai.service.GenerativeAIService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/generative-ai")
@RequiredArgsConstructor
@Tag(name = "Generative AI API", description = "생성형 AI가 제공하는 정보를 관리하는 API입니다.")
public class GenerativeAIController {

    // GenerativeAIServiceImpl 인스턴스를 주입받아 사용
    private final GenerativeAIService generativeAIService;

    /**
     * 프로젝트 상세페이지 가이드라인을 생성하는 POST 요청 처리
     * POST 요청을 사용하는 이유: AI를 통해 프로젝트 설명을 생성하는 작업은 단순 데이터 조회가 아닌
     * 새로운 데이터를 생성하는 작업이므로 POST가 적합함.
     *
     * @param aiProjectDescriptionDTO 프로젝트 설명을 생성하기 위한 입력 데이터 (DTO)
     * @return Mono<String> 생성된 프로젝트 설명 (비동기 처리)
     */
    @PostMapping("/project-description")
    @Operation(summary = "상세페이지 가이드라인 생성", description = "프로젝트의 상세페이지의 가이드라인을 생성합니다.")
    public Mono<String> getAIGeneratedProjectDescription(@RequestBody AIProjectDescriptionDTO aiProjectDescriptionDTO) {
        // Service 계층을 통해 AI 프로젝트 설명을 생성하고, 결과를 반환
        return generativeAIService.generateProjectDescription(aiProjectDescriptionDTO);
    }
}
