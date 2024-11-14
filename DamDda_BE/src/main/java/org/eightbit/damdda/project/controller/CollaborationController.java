package org.eightbit.damdda.project.controller;

import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.project.dto.CollaborationDTO;
import org.eightbit.damdda.project.dto.CollaborationDetailDTO;
import org.eightbit.damdda.project.dto.PageRequestDTO;
import org.eightbit.damdda.project.dto.PageResponseDTO;
import org.eightbit.damdda.project.service.CollaborationService;
import org.eightbit.damdda.security.user.User;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/collab")
@RequiredArgsConstructor
@Log4j2
public class CollaborationController {

    private final CollaborationService collaborationService;


    @GetMapping("/download")
    public ResponseEntity<?> downloadFile(@RequestParam String fileName) throws IOException {
        S3ObjectInputStream inputStream = collaborationService.downloadFIle(fileName);
        byte[] bytes = IOUtils.toByteArray(inputStream);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename(URLEncoder.encode(fileName, StandardCharsets.UTF_8)).build());
        return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
    }

    @PostMapping("/register/{projectId}")
    public ResponseEntity<?> register(@RequestPart("jsonData") String jsonDataStr,
                                      @RequestPart(name = "collabDocList", required = false) List<MultipartFile> collabDocList,
                                      @PathVariable Long projectId, @AuthenticationPrincipal User user) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        CollaborationDetailDTO collaborationDetailDTO = mapper.registerModule(new JavaTimeModule()).readValue(jsonDataStr, CollaborationDetailDTO.class);
        if (collabDocList != null) {
            collaborationDetailDTO.setCollabDocList(convertToObjectList(collabDocList));
        }
        collaborationDetailDTO.setUser_id(user.getLoginId());
        collaborationService.register(collaborationDetailDTO, projectId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }


    @GetMapping("/read/detail/{cno}")
    public ResponseEntity<?> readDetail(@PathVariable Long cno) throws JsonProcessingException {
        CollaborationDetailDTO detailDTO = collaborationService.readDetail(cno);
        return new ResponseEntity<>(detailDTO, HttpStatus.OK);
    }

    @GetMapping("/read/receive")
    public ResponseEntity<?> readReceive(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size, @AuthenticationPrincipal User user) {
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder().page(page).size(size).build();
        PageResponseDTO<CollaborationDTO> collaborationDTOPageResponseDTO = collaborationService.readReceive(pageRequestDTO, user.getLoginId());
        return new ResponseEntity<>(collaborationDTOPageResponseDTO, HttpStatus.OK);
    }

    @GetMapping("/read/request")
    public ResponseEntity<?> readRequest(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size, @AuthenticationPrincipal User user) {
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder().page(page).size(size).build();
        PageResponseDTO<CollaborationDTO> collaborationDTOPageResponseDTO = collaborationService.readRequest(pageRequestDTO, user.getLoginId());
        return new ResponseEntity<>(collaborationDTOPageResponseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody List<Long> cno, @AuthenticationPrincipal User user) throws JsonProcessingException {
        Integer response = collaborationService.delete(cno, user.getLoginId());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/approval")
    public ResponseEntity<?> approvalRequest(@RequestBody List<Long> cnoList) {
        collaborationService.approvalRequest(cnoList);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/reject")
    public ResponseEntity<?> rejectRequest(@RequestBody List<Long> cnoList) {
        collaborationService.rejectRequest(cnoList);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private List<Object> convertToObjectList(List<MultipartFile> multipartFiles) {
        return new ArrayList<>(multipartFiles);
    }

}
