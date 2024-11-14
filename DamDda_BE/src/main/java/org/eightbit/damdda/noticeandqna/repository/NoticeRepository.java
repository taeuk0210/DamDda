package org.eightbit.damdda.noticeandqna.repository;

import org.eightbit.damdda.noticeandqna.domain.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    /**
     * 삭제되지 않은(deletedAt이 null) 특정 프로젝트의 모든 공지사항을 조회.
     *
     * @param projectId 조회할 프로젝트의 ID.
     * @return 삭제되지 않은 공지사항 목록.
     */
    List<Notice> findAllByDeletedAtIsNullAndProjectId(Long projectId);

    /**
     * 특정 공지사항 소프트 삭제 처리 (deletedAt 필드를 현재 시간으로 설정).
     *
     * @param noticeId 삭제할 공지사항의 ID.
     * @return 업데이트된 레코드 수 (1: 성공, 0: 실패).
     */
    @Modifying
    @Transactional
    @Query("UPDATE Notice n SET n.deletedAt = current_timestamp WHERE n.id = :noticeId")
    int softDeleteNotice(Long noticeId);
}