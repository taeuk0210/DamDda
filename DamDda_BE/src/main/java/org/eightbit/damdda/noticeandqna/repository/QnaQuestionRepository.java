package org.eightbit.damdda.noticeandqna.repository;

import org.eightbit.damdda.noticeandqna.domain.QnaQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;

/**
 * QnaQuestion 엔티티를 위한 JPA 레포지토리.
 * Q&A 질문에 대한 데이터베이스 접근 및 관련 작업을 처리하는 인터페이스.
 */
public interface QnaQuestionRepository extends JpaRepository<QnaQuestion, Long> {

    /**
     * 특정 Q&A 질문의 작성자(memberId)를 가져오는 메서드.
     * QnaQuestion 엔티티의 id를 기반으로 작성자의 memberId를 조회.
     *
     * @param qnaQuestionId 삭제할 질문의 ID.
     * @return 작성자의 memberId.
     */
    Long findMemberIdById(Long qnaQuestionId);

    /**
     * 삭제되지 않은 특정 프로젝트의 Q&A 질문 목록을 페이징 처리하여 가져오는 메서드.
     * deletedAt이 null인 질문들만 반환.
     *
     * @param projectId 프로젝트 ID.
     * @param pageable  페이징 정보.
     * @return 페이징된 Q&A 질문 목록.
     */
    Page<QnaQuestion> findAllByDeletedAtIsNullAndProjectId(Long projectId, Pageable pageable);

    /**
     * 특정 Q&A 질문을 소프트 삭제(실제 삭제 대신 deletedAt 필드에 현재 시간 기록)하는 메서드.
     *
     * @param qnaQuestionId 삭제할 질문의 ID.
     * @return 성공적으로 업데이트된 행의 수.
     */
    @Modifying
    @Transactional
    @Query("UPDATE QnaQuestion q SET q.deletedAt = current_timestamp WHERE q.id = :qnaQuestionId")
    int softDeleteQnaQuestion(@Param("qnaQuestionId") Long qnaQuestionId);
}
