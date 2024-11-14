package org.eightbit.damdda.noticeandqna.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.common.utils.validation.CreateValidation;
import org.eightbit.damdda.common.utils.validation.UpdateValidation;
import org.eightbit.damdda.noticeandqna.dto.QnaQuestionDTO;
import org.eightbit.damdda.noticeandqna.service.QnaQuestionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/qna/question")
@RequiredArgsConstructor
@Tag(name = "Q&A Question API", description = "Q&A의 질문을 관리하는 API입니다.")
public class QnaQuestionController {

    private final QnaQuestionService qnaQuestionService;

    @PostMapping
    @Operation(summary = "Q&A 질문 생성", description = "새로운 Q&A 질문을 생성합니다.")
    public ResponseEntity<QnaQuestionDTO> createQnaQuestion(@Validated(CreateValidation.class) @RequestBody QnaQuestionDTO qnaQuestionDTO) {
        QnaQuestionDTO savedQnaQuestion = qnaQuestionService.saveQnaQuestion(qnaQuestionDTO);
        return ResponseEntity.ok(savedQnaQuestion);
    }

    @PutMapping("/{qnaQuestionId}")
    @Operation(summary = "Q&A 질문 수정", description = "주어진 ID의 Q&A 질문을 수정합니다.")
    public ResponseEntity<QnaQuestionDTO> updateQnaQuestion(@PathVariable Long qnaQuestionId,
                                                            @Validated(UpdateValidation.class) @RequestBody QnaQuestionDTO qnaQuestionDTO) {
        qnaQuestionDTO.setId(qnaQuestionId); // 경로에서 전달된 ID를 설정.
        QnaQuestionDTO updatedQnaQuestion = qnaQuestionService.saveQnaQuestion(qnaQuestionDTO);
        return ResponseEntity.ok(updatedQnaQuestion);
    }

    @DeleteMapping("/{qnaQuestionId}")
    @Operation(summary = "Q&A 질문 삭제", description = "주어진 ID의 Q&A 질문을 삭제합니다.")
    public ResponseEntity<Void> deleteQnaQuestion(@PathVariable Long qnaQuestionId) {
        // 공지사항을 소프트 삭제하고 결과를 반환.
        boolean deleted = qnaQuestionService.softDeleteQnaQuestion(qnaQuestionId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping
    @Operation(summary = "Q&A 조회", description = "주어진 프로젝트 ID의 Q&A 질문 목록을 조회합니다.")
    public ResponseEntity<Page<QnaQuestionDTO>> listQnaQuestions(@RequestParam long projectId, Pageable pageable) {
        // 프로젝트 ID에 해당하는 공지사항 리스트를 조회.
        Page<QnaQuestionDTO> qnaQuestions = qnaQuestionService.getQnaQuestionsByProjectId(projectId, pageable);
        return ResponseEntity.ok(qnaQuestions);
    }
}