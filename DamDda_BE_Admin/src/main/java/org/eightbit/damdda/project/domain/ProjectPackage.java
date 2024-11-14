package org.eightbit.damdda.project.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project_packages")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectPackage {

    /************************중요*******************/
    /*quantityLimited 줄어드는 메소드 필요.*/

    @Builder.Default // 초기값을 빌더에서 사용하기 위해 추가.
    @OneToMany(mappedBy = "projectPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    List<PackageRewards> packageRewards = new ArrayList<>();//초기화 안 하면 add 불가능
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String packageName;

    private int packagePrice;

    private int quantityLimited;

    private int salesQuantity;

    public void change(String name, int price, int quantityLimited) {
        this.packageName = name;
        this.packagePrice = price;
        this.quantityLimited = quantityLimited;

    }

    public void addPackageReward(List<PackageRewards> packageReward) {
        this.packageRewards.addAll(packageReward);
    }

    // 커스텀 toString() 메서드 ->  packageReward와 toString() 순환 참조 문제
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("ProjectPackage(id=").append(id)
                .append(", packageName=").append(packageName)
                .append(", packagePrice=").append(packagePrice)
                .append(", quantityLimited=").append(quantityLimited);

        sb.append(", packageRewards=[");
        for (PackageRewards reward : packageRewards) {
            sb.append("PackageRewards(id=").append(reward.getId())
                    .append(", rewardCount=").append(reward.getRewardCount());

            if (reward.getProjectReward() != null) {
                sb.append(", rewardName=").append(reward.getProjectReward().getRewardName())
                        .append(", optionType=").append(reward.getProjectReward().getOptionType())
                        .append(", optionList=");
                try {
                    sb.append(reward.getProjectReward().getOptionList());
                } catch (JsonProcessingException e) {
                    sb.append("Error processing JSON: ").append(e.getMessage());
                }
            }
            sb.append("), ");  // 각 PackageRewards 항목의 끝
        }
        if (!packageRewards.isEmpty()) {
            sb.setLength(sb.length() - 2);  // 마지막 ", " 제거
        }
        sb.append("]");  // packageRewards 리스트의 끝

        sb.append(")");  // ProjectPackage의 끝

        return sb.toString();
    }
}