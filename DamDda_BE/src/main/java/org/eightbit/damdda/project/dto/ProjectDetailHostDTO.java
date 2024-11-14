package org.eightbit.damdda.project.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProjectDetailHostDTO {
    private Long id;
    private String title;   //제목
    private String description; //설명
    private Long fundsReceive;  //받은 후원금
    private Long targetFunding; //목표 후원금
    private String nickName;    //진행자 닉네임
    private LocalDateTime startDate;    //시작일
    private LocalDateTime endDate;  //마감일
    private Long supporterCnt;  //후원자수
    private Long likerCnt;  //좋아요수
    private String category;    //카테고리
    private Integer approval;    //관리자 승인여부
    private String rejectMessage;   //거절메시지
    private List<String> productImages; // 이미지-사진5장 들어있을듯
    private List<String> tags;  //태그
    private boolean Liked;  // 좋아요 했는지 여부(T/F)
//    private List<projectImageDTO> imgs;
}

