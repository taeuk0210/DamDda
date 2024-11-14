package org.eightbit.damdda.noticeandqna.service;

import org.eightbit.damdda.noticeandqna.dto.QnaQuestionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QnaQuestionService {
    QnaQuestionDTO saveQnaQuestion(QnaQuestionDTO qnaQuestionDTO);

    boolean softDeleteQnaQuestion(Long qnaQuestionId);

    Page<QnaQuestionDTO> getQnaQuestionsByProjectId(Long projectId, Pageable pageable);

}