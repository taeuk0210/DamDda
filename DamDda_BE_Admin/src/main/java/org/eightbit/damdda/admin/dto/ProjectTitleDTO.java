package org.eightbit.damdda.admin.dto;


import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProjectTitleDTO {
    private Long projectId;
    private String title;
    private String organizer;
    private String thumbnailUrl;
    private Integer approval;
}
