package org.eightbit.damdda.noticeandqna.repository;

import org.eightbit.damdda.noticeandqna.domain.QnaReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface QnaReplyRepository extends JpaRepository<QnaReply, Long> {
    List<QnaReply> findAllByDeletedAtIsNullAndQnaQuestionId(Long qnaQuestionId);

    @Modifying
    @Transactional
    @Query("UPDATE QnaReply q SET q.deletedAt = current_timestamp WHERE q.id = :qnaReplyId")
    int softDeleteQnaReply(@Param("qnaReplyId") Long qnaReplyId);
}