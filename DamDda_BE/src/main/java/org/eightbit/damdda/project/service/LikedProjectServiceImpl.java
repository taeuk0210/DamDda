package org.eightbit.damdda.project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.member.service.MemberService;
import org.eightbit.damdda.project.domain.LikedProject;
import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.repository.LikedProjectRepository;
import org.eightbit.damdda.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;


@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class LikedProjectServiceImpl implements LikedProjectService {

    private final LikedProjectRepository likedProjectRepository;
    private final ProjectRepository projectRepository;
    private final MemberService memberService;

    @Override
    public Long insertLikedProject(Long projectId, Long memberId) {

        // member와 project가 이미 좋아요 상태인지 확인
        if (likedProjectRepository.existsByMember_IdAndProject_Id(memberId, projectId)) {
            throw new IllegalArgumentException("이미 좋아요 눌렸음");
        }

        Member member = memberService.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));


        project.setLikeCnt(project.getLikeCnt() + 1);

        LikedProject likedProject = LikedProject.builder()
                .member(member)
                .project(project)
                .build();

        return likedProjectRepository.save(likedProject).getId();
    }

    @Override
    public void deleteLikedProject(Long projectId, Long memberId) {
        // member와 project가 이미 좋아요 상태인지 아닌지 확인
        if (!likedProjectRepository.existsByMember_IdAndProject_Id(memberId, projectId)) {
            throw new IllegalArgumentException("이미 좋아요 취소 눌렸음");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        likedProjectRepository.deleteByProjectIdAndMemberId(projectId, memberId);
        project.setLikeCnt(project.getLikeCnt() - 1);

    }
}
