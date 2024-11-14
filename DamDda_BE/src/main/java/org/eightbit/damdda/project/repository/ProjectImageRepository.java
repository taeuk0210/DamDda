package org.eightbit.damdda.project.repository;

import org.eightbit.damdda.project.domain.ProjectImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectImageRepository extends JpaRepository<ProjectImage, Long> {
    ProjectImage findByProject_IdAndOrdAndImageType_Id(Long projectId, int ord, Long imageTypeId);

    List<ProjectImage> findAllByProjectId(Long projectId);

    List<ProjectImage> findAllByProjectIdOrderByOrd(Long projectId);

    void deleteByUrlIn(List<String> urls);

}
