package org.eightbit.damdda.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import java.time.LocalDate;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollaborationDTO {
    private Long id;//클라이언트로는 받지 않지만, 서버 -> 클라이언트때는 받음

    @NotBlank(message = "제목은 필수 값입니다.")
    private String title;

    @Builder.Default
    @NotBlank(message = "승인 상태는 필수 값입니다.")
    private String approval = "대기";

    @NotBlank(message = "날짜는 필수 값입니다.")
    /*중요 -> 시분초도 넣는 것인가?*/
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("CollaborateDate")
    private LocalDate CollaborateDate;

    //제안자의 이름.
    @NotBlank(message = "이름은 필수 값입니다.")
    private String name;
}
