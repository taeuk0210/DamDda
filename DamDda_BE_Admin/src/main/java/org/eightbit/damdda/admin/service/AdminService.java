package org.eightbit.damdda.admin.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.eightbit.damdda.admin.dto.*;
import org.eightbit.damdda.member.dto.MemberDTO;
import org.eightbit.damdda.project.dto.PackageDTO;
import org.eightbit.damdda.project.dto.ProjectDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface AdminService {
    ResponseEntity<?> logout(String accessToken, String clientIpAddress);

    ResponseEntity<Map<String, String>> reissue(String accessToken, String username, String refreshToken, String clientIpAddress);

    ResponseEntity<Map<String, String>> login(AccountCredentials credentials, String clientIpAddress);

    void updateApproval(ApprovalUpdateDTO approvalUpdateDTO);

    PageResponseDTO<ProjectTitleDTO> getProjectListByApproval(PageRequestDTO pageRequestDTO);

    ProjectDTO getProject(Long projectId);

    PageResponseDTO<MemberDTO> getMemberListByKeyword(PageRequestDTO pageRequestDTO);

    List<PackageDTO> viewPackage(Long project_id) throws JsonProcessingException;

}
