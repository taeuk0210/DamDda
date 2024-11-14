package org.eightbit.damdda.project.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "package_rewards_options")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PackageRewards {
    /************************중요**************************/
    /*Package만의 id를 만드는 방법도 고려*/
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "package_id")
    private ProjectPackage projectPackage;

    @ManyToOne
    @JoinColumn(name = "reward_id")
    private ProjectRewards projectReward;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @Setter
    private Project project;

    private int rewardCount; //선물 갯수

    // toString 메서드 대신 별도의 메서드 사용 -> toString 순환 참조 문제.
    public String getProjectPackageInfo() {
        if (projectPackage == null) return "null";
        return String.format("ProjectPackage(id=%d, packageName='%s', packagePrice=%d, quantityLimited=%d)",
                projectPackage.getId(), projectPackage.getPackageName(),
                projectPackage.getPackagePrice(), projectPackage.getQuantityLimited());
    }

    public String getProjectRewardInfo() {
        if (projectReward == null) return "null";
        try {
            return String.format("ProjectReward(id=%d, rewardName='%s', optionType='%s', optionList=%s)",
                    projectReward.getId(), projectReward.getRewardName(),
                    projectReward.getOptionType(), projectReward.getOptionList());
        } catch (Exception e) {
            return String.format("ProjectReward(id=%d, rewardName='%s', optionType='%s', optionListError='%s')",
                    projectReward.getId(), projectReward.getRewardName(),
                    projectReward.getOptionType(), e.getMessage());
        }
    }

    public String getProjectInfo() {
        if (project == null) return "null";
        return String.format("Project(id=%d, title='%s')", project.getId(), project.getTitle());
    }

    @Override
    public String toString() {

        return String.format("PackageRewards(id=%d, rewardCount=%d, projectPackage=%s, projectReward=%s, project=%s)",
                id, rewardCount, getProjectPackageInfo(), getProjectRewardInfo(), getProjectInfo());

    }
}

