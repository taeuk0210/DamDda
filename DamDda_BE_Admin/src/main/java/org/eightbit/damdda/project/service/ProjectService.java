package org.eightbit.damdda.project.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.eightbit.damdda.admin.dto.PageRequestDTO;
import org.eightbit.damdda.admin.dto.PageResponseDTO;
import org.eightbit.damdda.admin.dto.ProjectTitleDTO;
import org.eightbit.damdda.project.domain.PackageRewards;
import org.eightbit.damdda.project.domain.ProjectPackage;
import org.eightbit.damdda.project.domain.ProjectRewards;
import org.eightbit.damdda.project.dto.PackageDTO;
import org.eightbit.damdda.project.dto.ProjectDTO;
import org.eightbit.damdda.project.dto.RewardDTO;

import java.util.List;

public interface ProjectService {
    PageResponseDTO<ProjectTitleDTO> findByApproval(PageRequestDTO pageRequestDTO);
    ProjectDTO getProject(Long projectId);
    List<PackageDTO> viewPackage(Long project_id) throws JsonProcessingException;

    default RewardDTO rewardEntityToDto(ProjectRewards pr, List<PackageRewards> packageRewardList, Long packageId) throws JsonProcessingException {
        return RewardDTO.builder()
                .id(pr.getId())
                .name(pr.getRewardName())
                .count(packageRewardList.stream()
                        .filter(packageReward ->
                                packageReward.getProjectReward().getId().equals(pr.getId()) && packageReward.getProjectPackage().getId().equals(packageId)
                        )
                        .mapToInt(PackageRewards::getRewardCount).sum())
                .optionType(pr.getOptionType())
                .OptionList(pr.getOptionList())
                .build();
    }
    default PackageDTO packageEntityToDTO(ProjectPackage projectPackage, List<RewardDTO> rewardDTOList) {
        return PackageDTO.builder()
                .id(projectPackage.getId())
                .name(projectPackage.getPackageName())
                .price(projectPackage.getPackagePrice())
                .quantityLimited(projectPackage.getQuantityLimited())
                .RewardList(rewardDTOList)
                .build();
    }
}
