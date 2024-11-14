package org.eightbit.damdda.admin.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.admin.dto.*;
import org.eightbit.damdda.admin.dto.file.FileDTO;
import org.eightbit.damdda.admin.dto.file.FileUploadDTO;
import org.eightbit.damdda.admin.service.AdminService;
import org.eightbit.damdda.admin.service.FileService;
import org.eightbit.damdda.member.dto.MemberDTO;
import org.eightbit.damdda.project.dto.PackageDTO;
import org.eightbit.damdda.project.dto.ProjectDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Log4j2
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final FileService fileService;

    // 클라이언트에서 캐러셀 이미지 등록
    @PostMapping(value = "/files/carousels", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<FileDTO> upload(FileUploadDTO fileUploadDTO) {
        return fileService.uploadCarousel(fileUploadDTO);
    }

    // 캐러셀 이미지 수정(삭제) 요청
    @PutMapping("/files/carousels")
    public void modifyCarousels(@RequestBody List<String> fileNames) {
        fileService.modifyCarousel(fileNames);
    }

    // 클라이언트에서 조회할 캐러셀 이미지 url 요청
    @GetMapping("/files/carousels")
    public ResponseEntity<List<String>> getCarouselUrls() {
        return fileService.getCarouselUrls();
    }

    // 클라이언트에서 캐러셀 이미지 조회
    @GetMapping("/files/carousels/{fileName}")
    public ResponseEntity<?> downloadCarousel(@PathVariable String fileName) {
        return fileService.downloadResource("carousel", null, fileName, false);
    }

    // 클라이언트에서 프로젝트 문서 및 이미지 요청
    @GetMapping("/files/projects/{projectId}/{fileName}")
    public ResponseEntity<?> downloadImage(@PathVariable("fileName") String fileName,
                                           @PathVariable("projectId") Long projectId) {
        return fileService.downloadResource(null, projectId, fileName, false);
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String accessToken,
                                    HttpServletRequest request) {
        String clientIpAddress = request.getRemoteAddr();
        return adminService.logout(accessToken, clientIpAddress);
    }

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(@RequestBody RefreshDTO refreshDTO,
                                     @RequestHeader("Authorization") String accessToken,
                                     HttpServletRequest request) {
        String clientIpAddress = request.getRemoteAddr();
        return adminService.reissue(accessToken, refreshDTO.getUsername(), refreshDTO.getRefreshToken(), clientIpAddress);
    }

    // 로그인 POST 요청
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AccountCredentials credentials,
                                   HttpServletRequest request) {
        String clientIpAddress = request.getRemoteAddr();
        return adminService.login(credentials, clientIpAddress);
    }

    // 프로젝트 목록 요청(대기, 승인, 거절 별로)
    @GetMapping("/projects")
    public PageResponseDTO<ProjectTitleDTO> getList(PageRequestDTO pageRequestDTO) {
        return adminService.getProjectListByApproval(pageRequestDTO);
    }

    // 프로젝트 상세 요청
    @GetMapping("/projects/{projectId}")
    public ProjectDTO getProject(@PathVariable Long projectId) {
        return adminService.getProject(projectId);
    }

    // 프로젝트 승인/거절 처리
    @PutMapping("/projects/{projectId}")
    public void updateApproval(@RequestBody ApprovalUpdateDTO approvalUpdateDTO) {
        adminService.updateApproval(approvalUpdateDTO);
    }

    //회원 목록 요청(검색 기능 포함)
    @GetMapping("/members")
    public PageResponseDTO<MemberDTO> getUsers(PageRequestDTO pageRequestDTO) {
        return adminService.getMemberListByKeyword(pageRequestDTO);
    }

    //특정 프로젝트의 PACKAGE 조회
    @GetMapping("/packages/{projectId}")
    public ResponseEntity<?> viewPackage(@PathVariable("projectId") Long projectId) throws JsonProcessingException {
        List<PackageDTO> packages = adminService.viewPackage(projectId);
        return new ResponseEntity<>(packages, HttpStatus.OK);
    }

}
