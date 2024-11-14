package org.eightbit.damdda.project.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.project.domain.Category;
import org.eightbit.damdda.project.domain.ProjectDocument;
import org.eightbit.damdda.project.domain.ProjectImage;
import org.eightbit.damdda.project.domain.Tag;

import java.sql.Timestamp;
import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProjectDTO {

    private Long id;
    @JsonIgnore
    private Member member;
    private Category category;
    private List<Tag> tags;

    private String title;
    private String description;
    private String descriptionDetail;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Timestamp startDate;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Timestamp endDate;
    private Long targetFunding;
    private Long fundsReceive;
    private Long supporterCnt;
    private Long viewCnt;
    private Long likeCnt;
    private String thumbnailUrl;
//    @JsonFormat(pattern="yyyy-MM-dd")
//    private Timestamp submitAt;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Timestamp createdAt;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Timestamp deletedAt;

    private List<ProjectImage> images;
    private List<ProjectDocument> documents;
}
