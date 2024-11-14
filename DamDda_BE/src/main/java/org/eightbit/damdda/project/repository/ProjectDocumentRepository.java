package org.eightbit.damdda.project.repository;

import org.eightbit.damdda.project.domain.ProjectDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ProjectDocumentRepository extends JpaRepository<ProjectDocument, Long> {
    List<ProjectDocument> findAllByProjectId(Long projectId);

    List<ProjectDocument> findAllByProjectIdOrderByOrd(Long projectId);

    void deleteByUrlIn(List<String> urls);
}

