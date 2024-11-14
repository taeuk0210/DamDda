package org.eightbit.damdda.project.repository.search;

import org.eightbit.damdda.admin.dto.ProjectTitleDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectSearch {
    Page<ProjectTitleDTO> findByApproval(Integer approval, Pageable pageable);
}
