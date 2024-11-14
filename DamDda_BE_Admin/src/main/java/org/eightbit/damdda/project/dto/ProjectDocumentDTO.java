package org.eightbit.damdda.project.dto;

import lombok.*;
import org.eightbit.damdda.project.domain.Project;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProjectDocumentDTO {
    private Long id;
    private Project project;
    private String documentUrl;

}
