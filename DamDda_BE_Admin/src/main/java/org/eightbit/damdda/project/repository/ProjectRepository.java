package org.eightbit.damdda.project.repository;


import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.repository.search.ProjectSearch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long>, ProjectSearch {

}
