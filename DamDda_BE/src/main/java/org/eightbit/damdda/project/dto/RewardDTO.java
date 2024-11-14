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
public class RewardDTO {
    private Long id;

    @NotBlank(message = "선물 이름은 필수입니다.")
    private String name; //선물 이름.

    private int count; // 해당 package에서 선택된 reward의 개수.

    @JsonProperty("OptionList")
    private List<String> OptionList;

    @NotBlank(message = "옵션 타입은 필수입니다.")
    private String optionType;
}

