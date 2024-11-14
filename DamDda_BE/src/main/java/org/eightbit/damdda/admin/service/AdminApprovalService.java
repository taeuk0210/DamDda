package org.eightbit.damdda.admin.service;

import org.eightbit.damdda.admin.domain.AdminApproval;
import org.eightbit.damdda.project.domain.Project;

import java.util.List;
import java.util.Optional;

/**
 * AdminApproval에 대한 서비스 레이어 인터페이스.
 * 승인 관련 비즈니스 로직을 정의.
 */
public interface AdminApprovalService {

    /**
     * 프로젝트를 제출하여 승인을 요청.
     *
     * @param project 제출할 프로젝트
     */
    void submitProject(Project project);

    /**
     * 프로젝트 ID로 승인 기록을 조회.
     *
     * @param projectId 프로젝트 고유 ID
     * @return 해당 프로젝트에 대한 승인 기록 (Optional)
     */
    Optional<AdminApproval> findByProjectId(Long projectId);

    /**
     * 승인 상태에 따른 승인 기록을 조회.
     *
     * @param approval 승인 상태 (0: 대기, 1: 승인, 2: 거절)
     * @return 해당 승인 상태에 대한 승인 기록 리스트
     */
    List<AdminApproval> findAllByApproval(Integer approval);
}