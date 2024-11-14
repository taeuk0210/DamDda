package org.eightbit.damdda.project.service;

import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectService {

    Long getOrganizerId(Long projectId);

    ProjectRegisterDetailDTO getProjectDetail(Long projectId);

    List<WritingProjectDTO> getWritingProjectDTO(Long memberId);

    PageResponseDTO<ProjectBoxDTO> getProjects(PageRequestDTO pageRequestDTO, Long memberId, int page, int size, String category, String search, String progress, List<String> sortConditions);

    PageResponseDTO<ProjectBoxHostDTO> getListProjectBoxHostDTO(Long bno, PageRequestDTO pageRequestDTO);

    PageResponseDTO<ProjectBoxDTO> getListProjectBoxLikeDTO(Long memberId, PageRequestDTO pageRequestDTO);

    ProjectDetailHostDTO readProjectDetailHost(Long projectId, Long memberId);

    ProjectResponseDetailDTO readProjectDetail(Long projectId, Long memberId);

    void delProject(Long projectId);

    Long register(Long memberId,
                  ProjectDetailDTO projectDetailDTO,
                  boolean submit,
                  List<MultipartFile> productImages,
                  List<MultipartFile> descriptionImages,
                  List<MultipartFile> docs
    );

    Project findById(Long id);

    Long updateProject(ProjectDetailDTO projectDetailDTO,
                       Long projectId,
                       boolean submit,
                       List<MetaDTO> productImagesMeta,
                       List<MetaDTO> descriptionImagesMeta,
                       List<MetaDTO> docsMeta,
                       List<MultipartFile> productImages,
                       List<MultipartFile> descriptionImages,
                       List<MultipartFile> docs,
                       List<MetaDTO> updateProductImage,
                       List<MetaDTO> updateDescriptionImage,
                       List<MetaDTO> updateDocs
    );

    List<?> getDailySupportingByProjectId(Long projectId);

}
