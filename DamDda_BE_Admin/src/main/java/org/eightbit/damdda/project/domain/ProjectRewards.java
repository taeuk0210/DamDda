package org.eightbit.damdda.project.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project_rewards")
@Getter
@Setter //for test
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectRewards {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Builder.Default
    @OneToMany(mappedBy = "projectReward", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    List<PackageRewards> packageRewards = new ArrayList<>();

    //optionList를 json 형식으로 저장. (따로 테이블로 저장하지 않음)
    @Column(columnDefinition = "json")
    private String optionList;

    private String rewardName;

    private String optionType;

    //setter 함수
    public void setPackageReward(Project project) {
        PackageRewards packageRewards1 = PackageRewards.builder()
                .projectReward(this)
                .project(project)
                .build();
        packageRewards.add(packageRewards1);
    }

    //json 역직렬화
    public List<String> getOptionList() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(this.optionList, new TypeReference<>() {
        });
    }

    public void setOptionList(List<String> options) throws JsonProcessingException {
        //List<OptionDTO> -> json문자열
        ObjectMapper objectMapper = new ObjectMapper();
        this.optionList = objectMapper.writeValueAsString(options);
    }

    //packageReward와의 양방향 연관관계로 인한 순환 참조 문제 -> @ToString 사용 불가능.
    @Override
    public String toString() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return "ProjectReward{" +
                    "id=" + id +
                    ", optionType=" + optionType +
                    ", rewardName=" + rewardName +
                    ", optionList=" + objectMapper.writeValueAsString(getOptionList()) +
                    '}';
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

}

