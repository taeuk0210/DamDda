package org.eightbit.damdda.noticeandqna.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.common.utils.validation.CreateValidation;
import org.eightbit.damdda.common.utils.validation.UpdateValidation;
import org.eightbit.damdda.noticeandqna.dto.QnaReplyDTO;
import org.eightbit.damdda.noticeandqna.service.QnaReplyService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/qna/reply")
public class QnaReplyController {

    private final QnaReplyService qnaReplyService;

    @PostMapping
    @Operation(summary = "Q&A 답글 생성", description = "Q&A 질문에 대한 답글을 생성합니다.")
    public ResponseEntity<QnaReplyDTO> registerQna(@Validated(CreateValidation.class) @RequestBody QnaReplyDTO qnaReplyDTO) {
        QnaReplyDTO registerQna = qnaReplyService.saveQnaReply(qnaReplyDTO);
        return ResponseEntity.ok(registerQna);
    }

    @GetMapping
    @Operation(summary = "Q&A 답글 조회", description = "Q&A 질문에 대한 답글을 조회합니다.")
    public ResponseEntity<List<QnaReplyDTO>> listQnaReplies(@RequestParam Long qnaQuestionId) {
        List<QnaReplyDTO> getQnaReplies = qnaReplyService.getQnaReplies(qnaQuestionId);
        return ResponseEntity.ok(getQnaReplies);
    }

    @DeleteMapping("/{qnaQuestionId}")
    @Operation(summary = "Q&A 답글 삭제", description = "Q&A 질문에 대한 답글을 삭제합니다.")
    public ResponseEntity<Void> deleteQna(@PathVariable("qnaQuestionId") Long qnaReplyId) {
        boolean deleted = qnaReplyService.softDeleteQnaReply(qnaReplyId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/{qnaReplyId}")
    @Operation(summary = "Q&A 답글 수정", description = "Q&A 질문에 대한 답글을 수정합니다.")
    public ResponseEntity<QnaReplyDTO> modifyQna(@Validated(UpdateValidation.class) @RequestBody QnaReplyDTO qnaReplyDTO,
                                                 @PathVariable("qnaReplyId") Long qnaReplyId) {
        qnaReplyDTO.setId(qnaReplyId);
        QnaReplyDTO updateQnaReply = qnaReplyService.saveQnaReply(qnaReplyDTO);
        return ResponseEntity.ok(updateQnaReply);
    }
}