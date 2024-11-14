package org.eightbit.damdda.project.service;

public interface LikedProjectService {
    Long insertLikedProject(Long projectId, Long memberId);

    void deleteLikedProject(Long projectId, Long memberId);
}
