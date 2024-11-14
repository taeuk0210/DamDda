package org.eightbit.damdda.noticeandqna.service;

import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.common.utils.validation.ProjectValidator;
import org.eightbit.damdda.noticeandqna.domain.Notice;
import org.eightbit.damdda.noticeandqna.dto.NoticeDTO;
import org.eightbit.damdda.noticeandqna.repository.NoticeRepository;
import org.eightbit.damdda.security.util.SecurityContextUtil;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

/**
 * NoticeService의 구체적인 구현체.
 * 공지사항 생성, 수정, 삭제 및 조회 로직을 구현하며,
 * 사용자 인증 및 권한 검증을 수행.
 */
@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final ModelMapper modelMapper;
    private final NoticeRepository noticeRepository;
    private final ProjectValidator projectValidator;
    private final SecurityContextUtil securityContextUtil;

    /**
     * 공지사항을 저장하거나 수정하는 메서드.
     * 현재 로그인된 사용자가 해당 프로젝트의 진행자인지 검증한 후 공지사항을 저장함.
     *
     * @param noticeDTO 공지사항 정보를 담은 DTO 객체.
     * @return 저장된 공지사항의 정보를 담은 DTO.
     */
    @Override
    @Transactional
    public NoticeDTO saveNotice(NoticeDTO noticeDTO) {
        Long memberId = securityContextUtil.getAuthenticatedMemberId();  // 현재 로그인된 사용자 ID를 조회.
        projectValidator.validateMemberIsOrganizer(memberId, noticeDTO.getProjectId());  // 현재 사용자가 프로젝트의 진행자인지 검증.
        Notice notice = modelMapper.map(noticeDTO, Notice.class);  // DTO를 엔티티로 변환.
        Notice savedNotice = noticeRepository.save(notice);  // 공지사항을 저장.
        return modelMapper.map(savedNotice, NoticeDTO.class);  // 저장된 엔티티를 DTO로 변환하여 반환.
    }

    /**
     * 공지사항을 소프트 삭제하는 메서드.
     * 소프트 삭제는 공지사항의 삭제 여부만 변경하며, 데이터를 물리적으로 삭제하지 않음.
     * 현재 로그인된 사용자가 프로젝트의 진행자인지 확인한 후 삭제를 수행.
     *
     * @param noticeId  삭제할 공지사항의 ID.
     * @param projectId 공지사항이 속한 프로젝트 ID.
     * @return 삭제 성공 여부.
     */
    @Override
    @Transactional
    public boolean softDeleteNotice(Long noticeId, Long projectId) {
        Long memberId = securityContextUtil.getAuthenticatedMemberId();  // 현재 로그인된 사용자 ID를 조회.
        projectValidator.validateMemberIsOrganizer(memberId, projectId);  // 현재 사용자가 프로젝트의 진행자인지 검증.
        int deleteResult = noticeRepository.softDeleteNotice(noticeId);  // 소프트 삭제 수행.

        // 공지사항이 존재하지 않으면 예외를 발생.
        if (deleteResult == 0) {
            throw new NoSuchElementException("Notice with ID " + noticeId + " not found.");
        }

        return true;  // 삭제 성공 시 true 반환.
    }

    /**
     * 특정 프로젝트에 속한 삭제되지 않은 공지사항 목록을 조회하는 메서드.
     *
     * @param projectId 공지사항이 속한 프로젝트의 ID.
     * @return 삭제되지 않은 공지사항 리스트를 담은 DTO 객체 리스트.
     */
    @Override
    public List<NoticeDTO> getNoticesByProjectId(Long projectId) {
        List<Notice> notices = noticeRepository.findAllByDeletedAtIsNullAndProjectId(projectId);  // 프로젝트에 속한 삭제되지 않은 공지사항 조회.
        return notices.stream()
                .map(notice -> modelMapper.map(notice, NoticeDTO.class))  // 각 엔티티를 DTO로 변환.
                .collect(Collectors.toList());  // DTO 리스트로 반환.
    }

    /**
     * 공지사항 ID로 해당 공지사항이 속한 프로젝트의 ID를 조회하는 메서드.
     *
     * @param noticeId 공지사항의 ID.
     * @return 해당 공지사항이 속한 프로젝트의 ID.
     */
    @Override
    public Long getProjectIdFromNotice(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoSuchElementException("Notice with ID " + noticeId + " not found."));  // 공지사항이 존재하지 않으면 예외 발생.
        return notice.getProject().getId();  // 프로젝트 ID 반환.
    }

}