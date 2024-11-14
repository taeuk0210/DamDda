package org.eightbit.damdda.common.utils.validation;

import org.eightbit.damdda.common.exception.custom.UnauthorizedAccessException;
import org.eightbit.damdda.project.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class ProjectValidator {

    private final ProjectService projectService;

    @Autowired
    public ProjectValidator(@Lazy ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * 주어진 프로젝트의 진행자가 현재 로그인된 회원인지 검증하는 메서드.
     * 진행자가 일치하지 않으면 예외를 발생.
     *
     * @param memberId  현재 로그인된 사용자의 ID.
     * @param projectId 검증할 프로젝트의 ID.
     * @throws UnauthorizedAccessException 현재 사용자가 해당 프로젝트의 진행자가 아닌 경우 발생.
     */
    public void validateMemberIsOrganizer(Long memberId, Long projectId) {
        Long organizerId = projectService.getOrganizerId(projectId);  // ProjectService를 사용하여 진행자 ID 조회.
        if (!memberId.equals(organizerId)) {
            throw new UnauthorizedAccessException("Member ID unauthorized for project " + projectId);  // 진행자가 일치하지 않으면 예외 발생.
        }
    }
}
