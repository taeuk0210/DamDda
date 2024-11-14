package org.eightbit.damdda.generativeai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AIProjectDescriptionDTO는 생성형 AI를 통해 프로젝트 설명을 생성하기 위한
 * 데이터 전달 객체(DTO)입니다. 프로젝트 제목, 카테고리, 태그 목록, 설명을 포함합니다.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AIProjectDescriptionDTO {

    /**
     * 프로젝트 제목
     * 프로젝트를 간단하게 설명하는 제목입니다.
     */
    private String title;

    /**
     * 프로젝트 카테고리
     * 프로젝트가 속한 카테고리 정보를 나타냅니다.
     */
    private String category;

    /**
     * 프로젝트 태그 목록
     * 프로젝트에 대한 태그 목록을 배열로 전달받습니다.
     * 태그는 프로젝트와 관련된 키워드를 의미합니다.
     */
    private String[] tags;

    /**
     * 프로젝트에 대한 상세 설명
     * 프로젝트의 목적과 세부 사항을 설명하는 문자열입니다.
     */
    private String description;
}
