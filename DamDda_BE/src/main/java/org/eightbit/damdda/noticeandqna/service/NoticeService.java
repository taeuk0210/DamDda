package org.eightbit.damdda.noticeandqna.service;

import org.eightbit.damdda.noticeandqna.dto.NoticeDTO;

import java.util.List;

/**
 * Notice 서비스 인터페이스.
 * 공지사항 생성, 수정, 삭제 및 조회 관련 메서드를 정의.
 */
public interface NoticeService {

    /**
     * 공지사항을 저장하거나 수정하는 메서드.
     *
     * @param noticeDTO 공지사항 정보를 담은 DTO 객체.
     * @return 저장된 공지사항의 정보를 담은 DTO.
     */
    NoticeDTO saveNotice(NoticeDTO noticeDTO);

    /**
     * 공지사항을 소프트 삭제하는 메서드.
     * 소프트 삭제는 공지사항의 삭제 여부만 변경하며, 데이터를 물리적으로 삭제하지 않음.
     *
     * @param noticeId  삭제할 공지사항의 ID.
     * @param projectId 공지사항이 속한 프로젝트의 ID.
     * @return 삭제 성공 여부.
     */
    boolean softDeleteNotice(Long noticeId, Long projectId);

    /**
     * 특정 프로젝트에 속한 삭제되지 않은 공지사항 목록을 조회하는 메서드.
     *
     * @param projectId 공지사항이 속한 프로젝트의 ID.
     * @return 삭제되지 않은 공지사항 리스트를 담은 DTO 객체 리스트.
     */
    List<NoticeDTO> getNoticesByProjectId(Long projectId);

    /**
     * 공지사항 ID로 해당 공지사항이 속한 프로젝트의 ID를 조회하는 메서드.
     *
     * @param noticeId 공지사항의 ID.
     * @return 해당 공지사항이 속한 프로젝트의 ID.
     */
    Long getProjectIdFromNotice(Long noticeId);
}