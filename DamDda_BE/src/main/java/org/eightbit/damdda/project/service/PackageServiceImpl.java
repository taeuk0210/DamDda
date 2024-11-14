package org.eightbit.damdda.project.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.project.domain.PackageRewards;
import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.domain.ProjectPackage;
import org.eightbit.damdda.project.domain.ProjectRewards;
import org.eightbit.damdda.project.dto.PackageDTO;
import org.eightbit.damdda.project.dto.RewardDTO;
import org.eightbit.damdda.project.repository.PackageRepository;
import org.eightbit.damdda.project.repository.PackageRewardsRepository;
import org.eightbit.damdda.project.repository.ProjectRepository;
import org.eightbit.damdda.project.repository.RewardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class PackageServiceImpl implements PackageService {


    private final PackageRewardsRepository packageRewardsRepository;
    private final RewardRepository rewardRepository;
    private final PackageRepository packageRepository;
    private final ProjectRepository projectRepository;


    //선물 등록
    @Override
    @Transactional
    public Long registerReward(RewardDTO rewardDTO, Long project_id) throws JsonProcessingException {
        Project project = projectRepository.findById(project_id).orElseThrow(() -> new EntityNotFoundException("project not found"));
        ProjectRewards projectRewards = rewardDtoToEntity(rewardDTO); //reward dto -> entity
        projectRewards.setOptionList(rewardDTO.getOptionList());  //json 역직렬화
        projectRewards.setPackageReward(project);
        ProjectRewards reward = rewardRepository.save(projectRewards);
        return reward.getId();
    }

    //패키지 등록
    public Long registerPackage(PackageDTO packageDTO, Long projectId) {
        ProjectPackage projectPackage = packageDTOToEntity(packageDTO);
        ProjectPackage savedPackage = packageRepository.save(projectPackage);
        List<PackageRewards> newPackageRewards = new ArrayList<>();
        for (RewardDTO rewardDTO : packageDTO.getRewardList()) {
            List<PackageRewards> packageRewards = packageRewardsRepository.findPackageRewardByRewardId(rewardDTO.getId());
            for (PackageRewards pr : packageRewards) {
                PackageRewards newpackageRewards = PackageRewards.builder().projectPackage(projectPackage).projectReward(pr.getProjectReward()).rewardCount(rewardDTO.getCount()).project(pr.getProject()).build();
                newPackageRewards.add(newpackageRewards);
            }
        }
        //기존의 packageReward는(projectReward만 연결된) 중간 저장을 위해 남겨둠.
        packageRewardsRepository.saveAll(newPackageRewards);
        // 이미 저장된 ProjectPackage에 PackageRewards를 추가합니다.
        savedPackage.getPackageRewards().addAll(newPackageRewards);
        ProjectPackage resultPackage = packageRepository.save(savedPackage);  // 변경사항을 저장.
        return resultPackage.getId();
    }


    //패키지에 해당하는 선물 보여주는 기능
    @Override
    @Transactional(readOnly = true)
    public List<RewardDTO> viewRewardByPackage(Long package_id) {
        //패키지와 연관된 리워드 리스트를 보여줌.
        List<ProjectRewards> projectRewards = packageRewardsRepository.findRewardsByPackageId(package_id);
        // packageRewardsRepository에서 reward_count를 들고옴
        return projectRewards.stream().map(reward -> {
            // packageRewardsRepository에서 reward_count를 들고옴
            int rewardCount = packageRewardsRepository.findRewardCountByRewardId(package_id, reward.getId());
            try {
                return new RewardDTO(reward.getId(), reward.getRewardName(), rewardCount, reward.getOptionList(), reward.getOptionType());
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }).collect(Collectors.toList());
    }

    //프로젝트에 해당하는 리워드 보여주는 기능. 화면 설계서 17번, 19번
    @Override
    @Transactional(readOnly = true)
    public List<RewardDTO> viewRewardByProject(Long project_id) {
        //프로젝트와 연관된 리워드 리스트를 보여줌
        //대신 rewardCount는 설정 전이므로 입력x -> 임의의 rewardCount 초기값을 주는 형태 / 아니면 RewardDTO를 고치는 형태
        //아직 reward가 저장되지 않았으므로 count는 0
        return packageRewardsRepository.findRewardsByProjectId(project_id).stream().map(reward -> {
            //대신 rewardCount는 설정 전이므로 입력x -> 임의의 rewardCount 초기값을 주는 형태 / 아니면 RewardDTO를 고치는 형태
            try {
                return new RewardDTO(reward.getId(), reward.getRewardName(), 0, reward.getOptionList(), reward.getOptionType()); //아직 reward가 저장되지 않았으므로 count는 0
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }).collect(Collectors.toList());
    }

    //전체 프로젝트에 해당하는 패키지 보여줌.
    @Override
    @Transactional(readOnly = true)
    public List<PackageDTO> viewPackage(Long project_id) {
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


    //선물 구성 수정
    @Override
    @Transactional
    public void modifyPackage(PackageDTO packageDTO, Long project_id) {
        // 기존의 projectPackage 조회
        ProjectPackage projectPackage = packageRepository.findById(packageDTO.getId()).orElseThrow(() -> new NoSuchElementException("그런 패키지는 없음"));
        List<ProjectRewards> projectRewards = packageRewardsRepository.findRewardsByProjectId(project_id);
        Map<Long, ProjectRewards> projectRewardsMap = projectRewards.stream().collect(Collectors.toMap(ProjectRewards::getId, reward -> reward));
        //새로운 packageReward 생성
        List<PackageRewards> newPackageRewards = packageDTO.getRewardList().stream()
                .map(reward -> PackageRewards.builder()
                        .projectReward(projectRewardsMap.get(reward.getId()))
                        .rewardCount(reward.getCount())
                        .projectPackage(projectPackage)
                        .project(projectPackage.getPackageRewards().get(0).getProject())
                        .build())
                .collect(Collectors.toList());

        // 기존의 packageRewards 클리어 -> orphanRemoval 속성 때문에 부모와 연관관계가 끊어진 packageReward는 삭제됨.
        projectPackage.getPackageRewards().clear();
        projectPackage.addPackageReward(newPackageRewards); //기존의 객체를 초기화하고 새로운 객체를 한 번에 저장.
        // projectPackage 업데이트
        projectPackage.change(packageDTO.getName(), packageDTO.getPrice(), packageDTO.getQuantityLimited());
        // 변경사항 저장
        packageRepository.save(projectPackage);
    }


    //선물 삭제
    @Override
    public void deleteReward(Long reward_id) {
        rewardRepository.deleteById(reward_id);
    }

    //선물 구성 삭제
    @Override
    public void deletePackage(Long package_id) {
        packageRepository.deleteById(package_id);
    }


}
