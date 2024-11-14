package org.eightbit.damdda.admin.service.impl;


import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;

import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.admin.domain.Admin;
import org.eightbit.damdda.admin.domain.AdminApproval;
import org.eightbit.damdda.admin.dto.*;
import org.eightbit.damdda.admin.repository.AdminApprovalRepository;
import org.eightbit.damdda.admin.repository.AdminRepository;
import org.eightbit.damdda.admin.service.AdminService;
import org.eightbit.damdda.admin.service.RedisService;
import org.eightbit.damdda.common.service.JwtService;
import org.eightbit.damdda.member.dto.MemberDTO;
import org.eightbit.damdda.member.service.MemberService;
import org.eightbit.damdda.project.dto.PackageDTO;
import org.eightbit.damdda.project.dto.ProjectDTO;
import org.eightbit.damdda.project.service.ProjectService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final AdminApprovalRepository adminApprovalRepository;
    private final AuthenticationManager authenticationManager;

    private final ProjectService projectService;
    private final MemberService memberService;
    private final RedisService redisService;
    private final JwtService jwtService;

    @Override
    public ResponseEntity<?> logout(String accessToken, String clientIpAddress) {
        if (redisService.exists(clientIpAddress)) {
            boolean isDeleted = redisService.delete(clientIpAddress);

            LocalDateTime now = LocalDateTime.now();
            String formattedNow = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            log.info("Call logout : " + formattedNow);
            log.info("accessToken : " + accessToken);

            redisService.saveBlacklist(accessToken, formattedNow);
        }
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Map<String, String>> reissue(String accessToken, String username, String refreshToken, String clientIpAddress) {
        if (clientIpAddress != null && redisService.exists(clientIpAddress)) {
            String refreshTokenFromDB = (String) redisService.findByKey(clientIpAddress);

            if (refreshToken.equals(refreshTokenFromDB)) {
                // delete previous refresh token
                boolean isDeleted = redisService.delete(clientIpAddress);

                // get new tokens
                String newAccessToken = jwtService.getToken(username, JwtService.ACCESS_TOKEN_TYPE);
                String newRefreshToken = jwtService.getToken(username, JwtService.REFRESH_TOKEN_TYPE);
                // save new refresh token
                redisService.save(clientIpAddress, newRefreshToken);

                // response tokens
                Map<String, String> responseBody = new HashMap<>();
                responseBody.put("refreshToken", newRefreshToken);

                // 클라이언트에 전송할 AUTHORIZATION 헤더에 토큰을 넣어서 전달
                return ResponseEntity.ok()
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + newAccessToken)
                        .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization")
                        .body(responseBody);
            }
        }
        return ResponseEntity.internalServerError().build();
    }


    public ResponseEntity<Map<String, String>> login(AccountCredentials credentials, String clientIpAddress) {
        /*
         *  AuthenticationManager가 인증과정에서 사용하는 객체(Username~Token)에
         * 클라이언트가 전송한 username / password를 저장
         * */
        UsernamePasswordAuthenticationToken creds =
                new UsernamePasswordAuthenticationToken(
                        credentials.getLoginId(),
                        credentials.getPassword());
        /*
         * 아래 메소드가 호출되는 과정에서 UserDetailsServiceImpl에 override 한
         * loadUserByUsername이 호출되어 username을 가진 사용자가 DB에 존재하는지
         * 확인 후 내부적으로 로그인 처리함
         * */
        Authentication auth = authenticationManager.authenticate(creds);
        // Token 발급
        String accessToken = jwtService.getToken(auth.getName(), JwtService.ACCESS_TOKEN_TYPE);
        String refreshToken = jwtService.getToken(auth.getName(), JwtService.REFRESH_TOKEN_TYPE);

        redisService.save(clientIpAddress, refreshToken);
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("refreshToken", refreshToken);

        // 클라이언트에 전송할 AUTHORIZATION 헤더에 토큰을 넣어서 전달
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization")
                .body(responseBody);
    }


    @Override
    public PageResponseDTO<ProjectTitleDTO> getProjectListByApproval(PageRequestDTO pageRequestDTO) {
        return projectService.findByApproval(pageRequestDTO);
    }

    @Override
    public ProjectDTO getProject(Long projectId) {
        return projectService.getProject(projectId);
    }

    @Override
    public PageResponseDTO<MemberDTO> getMemberListByKeyword(PageRequestDTO pageRequestDTO) {
        return memberService.findByKeyword(pageRequestDTO);
    }

    @Override
    public void updateApproval(ApprovalUpdateDTO approvalUpdateDTO) {
        log.info(approvalUpdateDTO);
        AdminApproval adminApproval = adminApprovalRepository.findByProjectId(approvalUpdateDTO.getProjectId()).orElseThrow();
        log.info(adminApproval);
        adminApproval.changeApproval(approvalUpdateDTO);
        log.info(adminApproval);
        adminApprovalRepository.save(adminApproval);
    }

    @Override
    public List<PackageDTO> viewPackage(Long project_id) throws JsonProcessingException {
        return projectService.viewPackage(project_id);
    }


}
