package org.eightbit.damdda.project.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.eightbit.damdda.project.domain.PackageRewards;
import org.eightbit.damdda.project.domain.ProjectPackage;
import org.eightbit.damdda.project.domain.ProjectRewards;
import org.eightbit.damdda.project.dto.PackageDTO;
import org.eightbit.damdda.project.dto.RewardDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PackageService {
    Long registerReward(RewardDTO rewardDTO, Long project_id) throws JsonProcessingException;

    Long registerPackage(PackageDTO packageDTO, Long project_id);

    List<RewardDTO> viewRewardByPackage(Long package_id);

    List<RewardDTO> viewRewardByProject(Long project_id);

    List<PackageDTO> viewPackage(Long project_id);

    void modifyPackage(PackageDTO packageDTO, Long project_id);

    void deleteReward(Long reward_id);

    void deletePackage(Long package_id);

    //rewardDTo -> ProjectReward
    default ProjectRewards rewardDtoToEntity(RewardDTO rewardDTO) {
        return ProjectRewards.builder()
                .rewardName(rewardDTO.getName())
                .optionType(rewardDTO.getOptionType())
                .build();
    }

    //ProjectReward -> RewardDTO
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

    //PackageDTO -> ProjectPackage Entity
    default ProjectPackage packageDTOToEntity(PackageDTO packageDTO) {
        return ProjectPackage.builder()
                .packagePrice(packageDTO.getPrice())
                .packageName(packageDTO.getName())
                .quantityLimited(packageDTO.getQuantityLimited())
                .build();


    }

    //ProjectPackage -> ProjectDTO
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
