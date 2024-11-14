package org.eightbit.damdda.project.dto;


import lombok.*;

import java.time.LocalDateTime;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProjectBoxDTO {
    private Long id;
    private String title;   //프로젝트명
    private String description; //프로젝트 설명
    private String thumbnailUrl;    //썸네일 url
    private Long fundsReceive;  //후원금
    private Long targetFunding; //목표액
    private String nickName;    //프로젝트 담당자 닉네임
    private LocalDateTime endDate;      //프로젝트 마감일
    private boolean Liked;  // 좋아요 했는지 여부(T/F)
}
