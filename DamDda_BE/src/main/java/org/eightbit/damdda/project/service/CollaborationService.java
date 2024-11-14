package org.eightbit.damdda.project.service;

import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.eightbit.damdda.project.domain.Collaboration;
import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.dto.CollaborationDTO;
import org.eightbit.damdda.project.dto.CollaborationDetailDTO;
import org.eightbit.damdda.project.dto.PageRequestDTO;
import org.eightbit.damdda.project.dto.PageResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public interface CollaborationService {

    String uploadFile(MultipartFile file) throws IOException;

    S3ObjectInputStream downloadFIle(String fileName);

    void deleteFile(String fileName);

    void register(CollaborationDetailDTO collab, Long project_id) throws JsonProcessingException;

    CollaborationDetailDTO readDetail(Long rno);

    PageResponseDTO<CollaborationDTO> readReceive(PageRequestDTO pageRequestDTO, String userId);

    PageResponseDTO<CollaborationDTO> readRequest(PageRequestDTO pageRequestDTO, String userId);

    int delete(List<Long> cnoList, String user_id);

    void approvalRequest(List<Long> idList);

    void rejectRequest(List<Long> idList);

    default Collaboration collabDtoToEntiy(CollaborationDetailDTO collabDTO, Project project) {
        return Collaboration.builder()
                .savedAt(collabDTO.getCollaborationDTO().getCollaborateDate())
                .userId(collabDTO.getUser_id())
                .project(project)
                .collaborationText(collabDTO.getContent())
                .name(collabDTO.getCollaborationDTO().getTitle())
                .email(collabDTO.getEmail())
                .phoneNumber(collabDTO.getPhoneNumber())
                .build();
    }

    default CollaborationDetailDTO collabEntityToDto(Collaboration collaboration) {
        List<Object> collabDocList = collaboration.getCollabDocList() == null ? new ArrayList<>() : collaboration.getCollabDocList().stream().map(String.class::cast).collect(Collectors.toList());
        return CollaborationDetailDTO.builder()
                .collaborationDTO(CollaborationDTO.builder().id(collaboration.getId()).title(collaboration.getProject().getTitle()).approval(collaboration.getApproval()).CollaborateDate(collaboration.getSavedAt()).name(collaboration.getName()).build())
                .phoneNumber(collaboration.getPhoneNumber())
                .email(collaboration.getEmail())
                .collabDocList(collabDocList)
                .content(collaboration.getCollaborationText())
                .user_id(collaboration.getUserId())
                .build();
    }


    default CollaborationDTO collabEntityToDtoList(Collaboration collaboration) {
        return CollaborationDTO.builder()
                .id(collaboration.getId())
                .title(collaboration.getProject().getTitle())
                .approval(collaboration.getApproval()) //확인해보기
                .CollaborateDate(collaboration.getSavedAt())
                .name(collaboration.getName())
                .build();
    }
}
