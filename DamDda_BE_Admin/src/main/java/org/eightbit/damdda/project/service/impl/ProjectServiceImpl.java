package org.eightbit.damdda.project.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.admin.dto.PageRequestDTO;
import org.eightbit.damdda.admin.dto.PageResponseDTO;
import org.eightbit.damdda.admin.dto.ProjectTitleDTO;
import org.eightbit.damdda.admin.repository.AdminApprovalRepository;
import org.eightbit.damdda.project.domain.PackageRewards;
import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.domain.ProjectPackage;
import org.eightbit.damdda.project.domain.ProjectRewards;
import org.eightbit.damdda.project.dto.PackageDTO;
import org.eightbit.damdda.project.dto.ProjectDTO;
import org.eightbit.damdda.project.dto.RewardDTO;
import org.eightbit.damdda.project.repository.PackageRewardsRepository;
import org.eightbit.damdda.project.repository.ProjectDocumentRepository;
import org.eightbit.damdda.project.repository.ProjectImageRepository;
import org.eightbit.damdda.project.repository.ProjectRepository;
import org.eightbit.damdda.project.service.ProjectService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final AdminApprovalRepository adminApprovalRepository;
    private final ModelMapper modelMapper;
    private final ProjectImageRepository projectImageRepository;
    private final ProjectDocumentRepository projectDocumentRepository;
    private final PackageRewardsRepository packageRewardsRepository;

    @Override
    public ProjectDTO getProject(Long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        ProjectDTO projectDTO = modelMapper.map(project, ProjectDTO.class);
        projectDTO.setImages(projectImageRepository.findByProjectIdOrderByOrd(projectId));
        projectDTO.setDocuments(projectDocumentRepository.findByProjectIdOrderByOrd(projectId));
        return projectDTO;
    }

    @Override
    public PageResponseDTO<ProjectTitleDTO> findByApproval(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage(), pageRequestDTO.getSize(), Sort.by("id"));
        Page<ProjectTitleDTO> result = projectRepository.findByApproval(pageRequestDTO.getApproval(), pageable);
        PageResponseDTO<ProjectTitleDTO> response = PageResponseDTO.<ProjectTitleDTO>builder()
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalPages(result.getTotalPages())
                .totalCounts(result.getNumberOfElements())
                .dtoList(result.getContent())
                .build();
        return response;
    }

    @Override
    @Transactional(readOnly=true)
    public List<PackageDTO> viewPackage(Long project_id) throws JsonProcessingException {
        List<PackageDTO> packageDTOList = new ArrayList<>();
        List<PackageRewards> packageRewardList = packageRewardsRepository.findAllRewardsByProjectIdWithProjectReward(project_id);
        Map<ProjectPackage, List<ProjectRewards>> packageRewardsMap = packageRewardList.stream()
                .map(PackageRewards::getProjectPackage)
                .filter(Objects::nonNull).distinct()
                .collect(Collectors.toMap(projectPackage -> projectPackage, projectPackage -> packageRewardList.stream().filter(pr -> pr != null && pr.getProjectPackage() != null &&
                                pr.getProjectPackage().getId() != null && pr.getProjectPackage().getId().equals(projectPackage.getId()))
                        .map(PackageRewards::getProjectReward).collect(Collectors.toList())));
        //projectReward -> rewardDTO
        packageRewardsMap.forEach((projectPackage, projectReward) -> {
            List<RewardDTO> rewardDTOList = projectReward.stream()
                    .map(pr -> {
                        try {
                            return rewardEntityToDto(pr, packageRewardList, projectPackage.getId());
                        } catch (JsonProcessingException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .collect(Collectors.toList());
            packageDTOList.add(packageEntityToDTO(projectPackage, rewardDTOList));
        });
        return packageDTOList;
    }
}
