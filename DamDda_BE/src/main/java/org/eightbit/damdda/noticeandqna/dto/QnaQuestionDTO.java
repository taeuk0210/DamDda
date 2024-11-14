package org.eightbit.damdda.noticeandqna.dto;

import lombok.*;
import org.eightbit.damdda.noticeandqna.domain.QnaQuestion;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Q&A 질문 데이터를 전송하기 위한 DTO 클래스.
 * BaseDTO를 상속받아 공통 필드(id, savedAt)를 포함하며,
 * Q&A 질문에 대한 세부 정보를 담고 있음.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QnaQuestionDTO extends BaseDTO {

    /**
     * Q&A 질문이 속한 프로젝트의 ID.
     * - 필수 항목으로, null일 수 없음.
     */
    @NotNull(message = "프로젝트 ID는 필수 항목입니다.")
    private Long projectId;

    /**
     * Q&A 질문을 작성한 회원의 ID.
     */
    private String memberId;

    /**
     * Q&A 질문의 제목.
     * - 빈 칸일 수 없으며, 최소 5자에서 최대 100자 사이로 입력해야 함.
     */
    @NotBlank(message = "Q&A 제목은 빈 칸일 수 없습니다.")
    @Size(min = 5, max = 100, message = "Q&A 제목은 5자에서 100자 사이여야 합니다.")
    private String title;

    /**
     * Q&A 질문의 내용.
     * - 빈 칸일 수 없으며, 최소 10자에서 최대 500자 사이로 입력해야 함.
     */
    @NotBlank(message = "Q&A 내용은 빈 칸일 수 없습니다.")
    @Size(min = 10, max = 500, message = "Q&A 내용은 10자에서 500자 사이여야 합니다.")
    private String content;

    /**
     * Q&A 질문의 공개 설정.
     * - 'PUBLIC' 또는 'PRIVATE' 중 하나의 값이어야 하며, 빈 칸일 수 없음.
     */
    @NotNull(message = "공개 설정은 필수 항목입니다. 'PUBLIC' 또는 'PRIVATE' 중 하나여야 합니다.")
    private QnaQuestion.Visibility visibility;
}