package org.eightbit.damdda.project.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.project.dto.*;
import org.eightbit.damdda.project.service.LikedProjectService;
import org.eightbit.damdda.project.service.ProjectService;
import org.eightbit.damdda.security.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/project")
@Log4j2
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final LikedProjectService likedProjectService;

    @GetMapping("/projects")
    public PageResponseDTO<ProjectBoxDTO> getProjects(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "전체") String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String progress,
            @RequestParam(required = false) String[] sort,
            PageRequestDTO pageRequestDTO) {
        Long memberId = user == null ? 0L : user.getMemberId();
        List<String> sortConditions = sort != null ? Arrays.asList(sort) : List.of();
        return projectService.getProjects(pageRequestDTO, memberId, page, size, category, search, progress, sortConditions);
    }

    @GetMapping("/write/{projectId}")
    public ProjectRegisterDetailDTO getWriteProject(@PathVariable Long projectId) {
        return projectService.getProjectDetail(projectId);
    }

    @GetMapping("/write")
    public List<WritingProjectDTO> getWritingProjects(@AuthenticationPrincipal User user) {
        Long memberId = user.getMemberId();
        return projectService.getWritingProjectDTO(memberId);
    }

    @GetMapping("/like")
    public PageResponseDTO<ProjectBoxDTO> getLikedProjectList(@AuthenticationPrincipal User user,
                                                              PageRequestDTO pageRequestDTO) {
        Long memberId = user.getMemberId();
        return projectService.getListProjectBoxLikeDTO(memberId, pageRequestDTO);
    }

    @GetMapping(value = "/myproject")
    public PageResponseDTO<ProjectBoxHostDTO> getMyProjectList(@AuthenticationPrincipal User user,
                                                               PageRequestDTO pageRequestDTO) {
        Long memberId = user.getMemberId();
        return projectService.getListProjectBoxHostDTO(memberId, pageRequestDTO);
    }

    @GetMapping("/{projectId}")
    public ProjectResponseDetailDTO readProjectDetail(@AuthenticationPrincipal User user,
                                                      @PathVariable Long projectId) {
        Long memberId = user == null ? 0L : user.getMemberId();
        return projectService.readProjectDetail(projectId, memberId);
    }

    @GetMapping("/myproject/{projectId}")
    public ProjectDetailHostDTO readProjectDetailHost(@AuthenticationPrincipal User user,
                                                      @PathVariable Long projectId) {
        Long memberId = user.getMemberId();
        return projectService.readProjectDetailHost(projectId, memberId);
    }

    @PostMapping("/like")
    public Long registerLikedProject(@AuthenticationPrincipal User user,
                                     @RequestParam Long projectId) {
        Long memberId = user.getMemberId();
        return likedProjectService.insertLikedProject(projectId, memberId);
    }

    @DeleteMapping("/like")
    public void deleteLikedProject(@AuthenticationPrincipal User user,
                                   @RequestParam Long projectId) {
        Long memberId = user.getMemberId();
        likedProjectService.deleteLikedProject(projectId, memberId);
    }

    //@PostMapping("/register")
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Long registerPost(@AuthenticationPrincipal User user,
                             @RequestPart("projectDetailDTO") ProjectDetailDTO projectDetailDTO,
                             @RequestParam(value = "submit", required = false) String submit,
                             @RequestPart(value = "productImages", required = false) List<MultipartFile> productImages,
                             @RequestPart(value = "descriptionImages", required = false) List<MultipartFile> descriptionImages,
                             @RequestPart(value = "docs", required = false) List<MultipartFile> docs) {
        Long memberId = user.getMemberId();
        return projectService.register(memberId, projectDetailDTO, submit.equals("제출"), productImages, descriptionImages, docs);
    }

    @PutMapping("/register/{projectId}")
    public String registerPut(@PathVariable Long projectId,
                              @RequestPart(value = "productImagesMeta", required = false) List<MetaDTO> productImagesMeta,
                              @RequestPart(value = "descriptionImagesMeta", required = false) List<MetaDTO> descriptionImagesMeta,
                              @RequestPart(value = "docsMeta", required = false) List<MetaDTO> docsMeta,
                              @RequestPart(value = "productImages", required = false) List<MultipartFile> productImages,
                              @RequestPart(value = "descriptionImages", required = false) List<MultipartFile> descriptionImages,
                              @RequestPart(value = "docs", required = false) List<MultipartFile> docs,
                              @RequestPart(value = "updateProductImages", required = false) List<MetaDTO> updateProductImage,
                              @RequestPart(value = "updateDescriptionImages", required = false) List<MetaDTO> updateDescriptionImage,
                              @RequestPart(value = "updateDocs", required = false) List<MetaDTO> updateDocs,
                              @Valid @RequestPart("projectDetailDTO") ProjectDetailDTO projectDetailDTO,
                              String submit,
                              BindingResult bindingResult,
                              RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("errors", bindingResult.getAllErrors());
            return "error";  // 유효성 검증 실패 시 에러 페이지로 이동
        }

        projectId = projectService.updateProject(projectDetailDTO, projectId,
                submit.equals("제출"), productImagesMeta, descriptionImagesMeta, docsMeta,
                productImages, descriptionImages, docs, updateProductImage, updateDescriptionImage, updateDocs);
        return "projectId: " + projectId + "\n" + projectService.findById(projectId);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<String> registerDelete(@PathVariable Long projectId) {

        try {
            // 프로젝트가 존재하는지 확인
            projectService.findById(projectId);
            projectService.delProject(projectId);
            return ResponseEntity.ok("Project deleted successfully.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }

    // 일별 후원액 가져오는 쿼리
    @GetMapping("/daily/{projectId}")
    public ResponseEntity<List<?>> getDailySupportingByProjectId(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getDailySupportingByProjectId(projectId));
    }

}