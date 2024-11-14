package org.eightbit.damdda.generativeai.service;

import org.eightbit.damdda.generativeai.dto.AIProjectDescriptionDTO;
import reactor.core.publisher.Mono;

/**
 * 생성형 AI 서비스를 위한 인터페이스
 * <p>
 * 이 인터페이스는 AI를 통해 프로젝트 설명을 생성하는 기능을 정의합니다.
 * 이 인터페이스를 구현하는 클래스는 외부 AI API와의 상호작용을 담당합니다.
 */
public interface GenerativeAIService {

    /**
     * 프로젝트 설명을 생성하는 메서드
     *
     * @param aiProjectDescriptionDTO 프로젝트 설명 생성을 위한 데이터 (제목, 카테고리, 태그, 설명 포함)
     * @return Mono<String> 생성된 프로젝트 설명 (비동기 처리)
     */
    Mono<String> generateProjectDescription(AIProjectDescriptionDTO aiProjectDescriptionDTO);
}
