package org.eightbit.damdda.noticeandqna.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * 공지사항(Notice)을 전송하기 위한 데이터 전송 객체(DTO).
 * BaseDTO를 상속받아 공통 필드(id, savedAt)를 재사용하며,
 * 공지사항에 대한 제목, 내용, 프로젝트 ID를 포함.
 */
@Data
@EqualsAndHashCode(callSuper = true)  // BaseDTO의 equals와 hashCode 메서드 재사용.
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoticeDTO extends BaseDTO {

    /**
     * 공지사항 제목.
     * - 제목은 최소 5자에서 최대 100자 사이여야 하며, 반드시 입력해야 함.
     * - 유효성 검사를 통해 빈 값이 허용되지 않음.
     */
    @NotBlank(message = "공지사항 제목은 필수 항목입니다.")
    @Size(min = 5, max = 100, message = "제목은 5자 이상, 100자 이하로 입력해야 합니다.")
    private String title;

    /**
     * 공지사항 내용.
     * - 내용은 최소 10자에서 최대 500자 사이여야 하며, 반드시 입력해야 함.
     * - 유효성 검사를 통해 빈 값이 허용되지 않음.
     */
    @NotBlank(message = "공지사항 내용은 필수 항목입니다.")
    @Size(min = 10, max = 500, message = "내용은 10자 이상, 500자 이하로 입력해야 합니다.")
    private String content;

    /**
     * 공지사항이 속한 프로젝트의 ID.
     * - 프로젝트는 반드시 존재해야 하며, null일 수 없음.
     */
    @NotNull(message = "프로젝트 ID는 필수 항목입니다.")
    private Long projectId;
}