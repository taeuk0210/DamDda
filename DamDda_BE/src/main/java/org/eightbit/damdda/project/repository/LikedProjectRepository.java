package org.eightbit.damdda.project.repository;

import org.eightbit.damdda.project.domain.LikedProject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikedProjectRepository extends JpaRepository<LikedProject, Long> {
    void deleteByProjectIdAndMemberId(Long projectId, Long memberId);

    List<LikedProject> findAllByMemberId(Long memberId);

    Page<LikedProject> findAllByMember_Id(Long memberId, Pageable pageable);

    boolean existsByMember_IdAndProject_Id(Long memberId, Long projectId);

    Long countByProjectId(Long projectId);
}
