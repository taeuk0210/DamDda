package org.eightbit.damdda.project.repository;

import org.eightbit.damdda.project.domain.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectRepositoryCustom {


    Page<Project> findProjects(Long memberId, String category, String search, String progress, List<String> sortConditions, Pageable pageable);

    Page<Project> getProjectByRecommendOrder(Long memberId, String category, String search, String progress, List<String> sortConditions, Pageable pageable);

}