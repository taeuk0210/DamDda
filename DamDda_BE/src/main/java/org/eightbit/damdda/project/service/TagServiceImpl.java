package org.eightbit.damdda.project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.domain.Tag;
import org.eightbit.damdda.project.dto.TagDTO;
import org.eightbit.damdda.project.repository.ProjectRepository;
import org.eightbit.damdda.project.repository.TagRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final ProjectRepository projectRepository;

    public List<Tag> registerTags(List<TagDTO> tags) {
        List<String> tagNames = tags.stream()
                .map(tagDTO -> registerTag(tagDTO.getName()))  // 각각의 태그 등록
                .collect(Collectors.toList());

        return tagNames.stream()
                .map(this::getTag)  // 태그 등록 서비스 호출
                .collect(Collectors.toList());
    }

    @Override
    public String registerTag(String tagName) {
        // 태그가 존재하는지 확인
        Tag tag = tagRepository.findByName(tagName);

        if (tag == null) {
            tag = Tag.builder()
                    .name(tagName)
                    .usageFrequency(0)  // 새로 등록이므로 사용 빈도는 0
                    .build();

            // 태그 저장
            tagName = tagRepository.save(tag).getName();
        }
        return tagName;
    }

    @Override
    // 태그 등록 및 프로젝트에 태그 추가
    public List<Tag> addProjectToTags(List<TagDTO> tagDTOs, Long projectId) {
        registerTags(tagDTOs);
        // 프로젝트가 존재하는지 확인
        projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));


        // 각 TagDTO의 태그 이름을 추출하고 등록한 후, 결과를 리스트로 반환
        List<String> tagNames = tagDTOs.stream()
                .map(tagDTO -> addProjectToTag(tagDTO.getName(), projectId))  // 각각의 태그 등록
                .collect(Collectors.toList());

        return tagNames.stream()
                .map(this::getTag)  // 태그 등록 서비스 호출
                .collect(Collectors.toList());
    }

    @Override
    public String addProjectToTag(String tagName, Long projectId) {
        // 태그가 존재하는지 확인
        Tag tag = tagRepository.findByName(tagName);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (tag.getProjects() == null || tag.getProjects().isEmpty()) {

            List<Project> projectList = new ArrayList<>();
            projectList.add(project);

            tag.setProjects(projectList);
            // 태그가 존재하면 usageFrequency +1
            tag.setUsageFrequency(1);

        } else {

            // 프로젝트 리스트 복사 후 추가 (새 리스트 생성)
            List<Project> updatedProjects = new ArrayList<>(tag.getProjects());
            updatedProjects.add(project);

            tag.setProjects(updatedProjects);
            // 태그가 존재하면 usageFrequency +1
            tag.setUsageFrequency(tag.getUsageFrequency() + 1);
        }

        return tagName;

    }

    @Override
    // 태그 등록 및 프로젝트에 태그 추가
    public List<Tag> delProjectFromTags(Project project) {

        List<Tag> projectTags = project.getTags();

        // 각 TagDTO의 태그 이름을 추출하고 등록한 후, 결과를 리스트로 반환
        List<String> tagNames = projectTags.stream()
                .map(tagDTO -> delProjectFromTag(tagDTO.getName(), project))  // 각각의 태그 등록
                .collect(Collectors.toList());

        return tagNames.stream()
                .map(this::getTag)  // 태그 등록 서비스 호출
                .collect(Collectors.toList());
    }

    @Override
    public String delProjectFromTag(String tagName, Project project) {
        // 태그가 존재하는지 확인
        Tag tag = tagRepository.findByName(tagName);

        // 프로젝트 리스트 복사 후 추가 (새 리스트 생성)
        List<Project> updatedProjects = new ArrayList<>(tag.getProjects());
        updatedProjects.remove(project);

        tag.setProjects(updatedProjects);
        tag.setUsageFrequency(tag.getUsageFrequency() - 1);

        return tagName;
    }

    @Override
    public Tag getTag(String tagName) {
        return tagRepository.findByName(tagName);
    }

}
