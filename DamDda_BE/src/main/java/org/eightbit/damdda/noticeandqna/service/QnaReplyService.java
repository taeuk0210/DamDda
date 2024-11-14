package org.eightbit.damdda.noticeandqna.service;

import org.eightbit.damdda.noticeandqna.dto.QnaReplyDTO;

import java.util.List;

public interface QnaReplyService {

    QnaReplyDTO saveQnaReply(QnaReplyDTO qnaReplyDTO);

    boolean softDeleteQnaReply(Long qnaReplyId);

    List<QnaReplyDTO> getQnaReplies(Long qnaQuestionId);

    void validateQnaReply(Long memberId, Long id);
}