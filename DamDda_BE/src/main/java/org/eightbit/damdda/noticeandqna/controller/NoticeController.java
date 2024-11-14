package org.eightbit.damdda.noticeandqna.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.common.utils.validation.CreateValidation;
import org.eightbit.damdda.common.utils.validation.UpdateValidation;
import org.eightbit.damdda.noticeandqna.dto.NoticeDTO;
import org.eightbit.damdda.noticeandqna.service.NoticeService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
@Tag(name = "Notice API", description = "공지사항을 관리하는 API입니다.")
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping
    @Operation(summary = "공지사항 생성", description = "새로운 공지사항을 생성합니다.")
    public ResponseEntity<NoticeDTO> createNotice(@Validated(CreateValidation.class) @RequestBody NoticeDTO noticeDTO) {
        NoticeDTO savedNotice = noticeService.saveNotice(noticeDTO);
        return ResponseEntity.ok(savedNotice);
    }

    @PutMapping("/{noticeId}")
    @Operation(summary = "공지사항 수정", description = "주어진 ID의 공지사항을 수정합니다.")
    public ResponseEntity<NoticeDTO> updateNotice(@PathVariable Long noticeId,
                                                  @Validated(UpdateValidation.class) @RequestBody NoticeDTO noticeDTO) {
        noticeDTO.setId(noticeId); // 경로에서 전달된 ID를 설정.
        NoticeDTO updatedNotice = noticeService.saveNotice(noticeDTO);
        return ResponseEntity.ok(updatedNotice);
    }

    @DeleteMapping("/{noticeId}")
    @Operation(summary = "공지사항 삭제", description = "주어진 ID의 공지사항을 삭제합니다.")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long noticeId) {
        // 공지사항을 소프트 삭제하고 결과를 반환.
        boolean deleted = noticeService.softDeleteNotice(noticeId, noticeService.getProjectIdFromNotice(noticeId));
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping
    @Operation(summary = "프로젝트의 공지사항 목록 조회", description = "주어진 프로젝트 ID의 공지사항 목록을 조회합니다.")
    public ResponseEntity<List<NoticeDTO>> listNotices(@RequestParam long projectId) {
        // 프로젝트 ID에 해당하는 공지사항 리스트를 조회.
        List<NoticeDTO> notices = noticeService.getNoticesByProjectId(projectId);
        return ResponseEntity.ok(notices);
    }
}