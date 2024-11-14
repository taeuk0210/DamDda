package org.eightbit.damdda.admin.service;

import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.admin.domain.AdminApproval;
import org.eightbit.damdda.admin.repository.AdminApprovalRepository;
import org.eightbit.damdda.project.domain.Project;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * AdminApprovalService 구현체.
 * 관리자 승인 관련 비즈니스 로직을 처리.
 */
@Service
@RequiredArgsConstructor
public class AdminApprovalServiceImpl implements AdminApprovalService {

    private final AdminApprovalRepository adminApprovalRepository;

    /**
     * 프로젝트를 제출하여 승인을 요청.
     * AdminApproval 엔티티를 생성하고 저장.
     *
     * @param project 제출할 프로젝트
     */
    @Override
    @Transactional
    public void submitProject(Project project) {
        AdminApproval adminApproval = AdminApproval.builder()
                .approval(0)
                .project(project)
                .build();
        adminApprovalRepository.save(adminApproval);
    }

    /**
     * 프로젝트 ID로 승인 기록을 조회.
     *
     * @param projectId 프로젝트 고유 ID
     * @return 해당 프로젝트에 대한 승인 기록 (Optional)
     */
    @Override
    public Optional<AdminApproval> findByProjectId(Long projectId) {
        return adminApprovalRepository.findByProjectId(projectId);
    }

    /**
     * 승인 상태에 따른 승인 기록을 조회.
     *
     * @param approval 승인 상태 (0: 대기, 1: 승인, 2: 거절)
     * @return 해당 승인 상태에 대한 승인 기록 리스트
     */
    @Override
    public List<AdminApproval> findAllByApproval(Integer approval) {
        return adminApprovalRepository.findAllByApproval(approval);
    }
}