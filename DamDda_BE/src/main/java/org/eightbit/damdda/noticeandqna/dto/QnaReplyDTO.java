package org.eightbit.damdda.noticeandqna.dto;

import lombok.*;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QnaReplyDTO extends BaseDTO {

    // Q&A 댓글이 작성된 질문 ID
    private Long qnaQuestionId;

    // Q&A 댓글 작성자 ID
    private String memberId;

    // 부모 댓글 ID
    private Long parentReplyId;

    // 댓글 내용
    @NotBlank(message = "댓글 내용은 빈 칸일 수 없습니다.")
    @Size(min = 1, max = 300, message = "댓글은 1자에서 300자 사이여야 합니다.")
    private String content;

    // 댓글 깊이
    private int depth;

    // 댓글의 전체 나열 순서에서의 위치
    @Min(value = 1, message = "값은 1 이상이어야 합니다.")
    private int orderPosition;
}