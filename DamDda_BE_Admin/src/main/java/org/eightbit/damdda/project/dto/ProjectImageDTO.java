package org.eightbit.damdda.project.dto;


import lombok.*;
import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.domain.ProjectImageType;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProjectImageDTO {
    private Long id;
    private Project project;
    private String imageUrl;
    private ProjectImageType imageType;

}
