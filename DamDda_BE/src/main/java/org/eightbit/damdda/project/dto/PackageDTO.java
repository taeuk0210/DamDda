package org.eightbit.damdda.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PackageDTO {

    private Long id;

    @NotBlank(message = "패키지 이름은 필수 값입니다.")
    private String name; //package name

    private int price;

    private int quantityLimited;

    @JsonProperty("RewardList")
    private List<RewardDTO> RewardList;

}


