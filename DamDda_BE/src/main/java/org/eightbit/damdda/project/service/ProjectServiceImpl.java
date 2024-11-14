package org.eightbit.damdda.project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.admin.domain.AdminApproval;
import org.eightbit.damdda.admin.service.AdminApprovalService;
import org.eightbit.damdda.common.utils.validation.ProjectValidator;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.member.service.MemberService;
import org.eightbit.damdda.order.service.SupportingProjectService;
import org.eightbit.damdda.project.domain.*;
import org.eightbit.damdda.project.dto.*;
import org.eightbit.damdda.project.repository.*;
import org.eightbit.damdda.security.util.SecurityContextUtil;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final TagService tagService;
    private final ImgService imgService;
    private final DocService docService;
    private final MemberService memberService;
    private final CategoryRepository categoryRepository;
    private final AdminApprovalService adminApprovalService;
    private final ProjectRepository projectRepository;
    private final LikedProjectRepository likedProjectRepository;
    private final ProjectImageRepository projectImageRepository;
    private final ProjectDocumentRepository projectDocumentRepository;
    private final SupportingProjectService supportingProjectService;
    private final ProjectValidator projectValidator;
    private final SecurityContextUtil securityContextUtil;

    @Override
    public ProjectRegisterDetailDTO getProjectDetail(Long projectId) {
        projectValidator.validateMemberIsOrganizer(securityContextUtil.getAuthenticatedMemberId(), projectId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementException("해당 아이디와 일치하는 프로젝트 없음! Project not found with ID: " + projectId));
        List<ProjectImage> projectImages = projectImageRepository.findAllByProjectIdOrderByOrd(projectId);
        List<String> productImages = projectImages.stream()
                .filter(projectImage -> projectImage.getImageType().getImageType().equals("product"))
                .map(ProjectImage::getUrl)  // URL에 "http://files/projects/" 추가
                .collect(Collectors.toList());

        List<String> descriptionImages = projectImages.stream()
                .filter(projectImage -> projectImage.getImageType().getImageType().equals("description"))
                .map(ProjectImage::getUrl)
                .collect(Collectors.toList());

        List<ProjectDocument> projectDocs = projectDocumentRepository.findAllByProjectIdOrderByOrd(projectId);

        List<String> docs = projectDocs.stream()
                .map(ProjectDocument::getUrl)  // URL에 "http://files/projects/" 추가
                .collect(Collectors.toList());

        List<Tag> tags = project.getTags();
        List<String> tagDTOs = tags.stream()
                .map(Tag::getName)
                .collect(Collectors.toList());

        return ProjectRegisterDetailDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .descriptionDetail(project.getDescriptionDetail())
                .targetFunding(project.getTargetFunding())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .category(project.getCategory() == null ? null : project.getCategory().getName())
                .productImages(productImages)
                .descriptionImages(descriptionImages)
                .docs(docs)
                .tags(tagDTOs)
                .build();

    }

    @Override
    public Long getOrganizerId(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementException("해당 아이디와 일치하는 프로젝트 없음! Project not found with ID: " + projectId));
        return project.getMember().getId();
    }

    @Override
    public PageResponseDTO<ProjectBoxDTO> getProjects(PageRequestDTO pageRequestDTO, Long memberId, int page, int size, String category, String search, String progress, List<String> sortConditions) {
        PageRequest pageable = PageRequest.of(page - 1, size);  // PageRequest를 사용해 페이지와 크기를 지정

        Page<Project> projects;
        if (!sortConditions.isEmpty() && "fundsReceive".equals(sortConditions.get(0))) {
            List<Project> sortProjects = projectRepository.findAllSortedByFundingRatio(category, search, progress);
            projects = new PageImpl<>(sortProjects, pageable, sortProjects.size());
        } else if (!sortConditions.isEmpty() && "recommend".equals(sortConditions.get(0))) {
            projects = projectRepository.getProjectByRecommendOrder(memberId, category, search, progress, sortConditions, pageable);
        } else {
            projects = projectRepository.findProjects(memberId, category, search, progress, sortConditions, pageable);
        }

        final List<Long> likedProjectId;
        if (memberId != null) {
            likedProjectId = likedProjectRepository.findAllByMemberId(memberId).stream()
                    .map(likedProject -> likedProject.getProject().getId())
                    .collect(Collectors.toList());
        } else {
            likedProjectId = new ArrayList<>();  // null인 경우 빈 리스트로 초기화
        }

        List<AdminApproval> approvedAdminApprovals = adminApprovalService.findAllByApproval(1);

        Set<Long> approvedProjectIds = approvedAdminApprovals.stream()
                .map(adminApproval -> adminApproval.getProject().getId())
                .collect(Collectors.toSet());

        List<ProjectBoxDTO> dtoList = projects.getContent().stream()
                .filter(project -> approvedProjectIds.contains(project.getId()))  // approval이 1인 것만 필터링
                .map(project -> ProjectBoxDTO.builder()
                        .id(project.getId())
                        .title(project.getTitle())
                        .description(project.getDescription())
                        .thumbnailUrl(project.getThumbnailUrl())
                        .fundsReceive(project.getFundsReceive())
                        .targetFunding(project.getTargetFunding())
                        .nickName(project.getMember().getNickname())
                        .endDate(project.getEndDate())
                        .Liked(likedProjectId.contains(project.getId()))  // 좋아요 여부는 기본적으로 false
                        .build())
                .collect(Collectors.toList());

// 서비스 레이어에서 페이지네이션 적용
        int start = (page - 1) * size;
        int end = Math.min(start + size, dtoList.size());
        List<ProjectBoxDTO> paginatedList = dtoList.subList(start, end);

// PageResponseDTO로 반환
        return PageResponseDTO.<ProjectBoxDTO>withAll()
                .pageRequestDTO(pageRequestDTO)  // 페이지 요청 정보
                .dtoList(paginatedList)  // 페이지네이션된 DTO 리스트
                .total(dtoList.size())   // 전체 데이터 수
                .build();
    }

    @Override
    public PageResponseDTO<ProjectBoxDTO> getListProjectBoxLikeDTO(Long memberId, PageRequestDTO pageRequestDTO) {
        Pageable pageable =
                PageRequest.of(pageRequestDTO.getPage() <= 0 ?
                                0 : pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                        Sort.by("id").ascending());

        Page<LikedProject> likedProjects = likedProjectRepository.findAllByMember_Id(memberId, pageable);
        List<AdminApproval> approvedAdminApprovals = adminApprovalService.findAllByApproval(1);

        Set<Long> approvedProjectIds = approvedAdminApprovals.stream()
                .map(adminApproval -> adminApproval.getProject().getId())
                .collect(Collectors.toSet());

        List<ProjectBoxDTO> dtoList = likedProjects.getContent().stream()
                .map(LikedProject::getProject)
                .filter(project -> approvedProjectIds.contains(project.getId()))  // approval이 1인 것만 필터링
                .map(project -> ProjectBoxDTO.builder()
                        .id(project.getId())
                        .title(project.getTitle())
                        .description(project.getDescription())
                        .thumbnailUrl(project.getThumbnailUrl())
                        .fundsReceive(project.getFundsReceive())
                        .targetFunding(project.getTargetFunding())
                        .nickName(project.getMember().getNickname())
                        .endDate(project.getEndDate())
                        .Liked(true)
                        .build())
                .collect(Collectors.toList());

        return PageResponseDTO.<ProjectBoxDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .dtoList(dtoList)
                .total((int) likedProjects.getTotalElements())
                .build();

    }

    @Override
    public PageResponseDTO<ProjectBoxHostDTO> getListProjectBoxHostDTO(Long memberId, PageRequestDTO pageRequestDTO) {
        Pageable pageable =
                PageRequest.of(pageRequestDTO.getPage() <= 0 ?
                                0 : pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                        Sort.by("id").ascending());

        Page<Project> result = projectRepository.listOfProjectBoxHost(memberId, pageable);

        final List<Long> likedProjectId;
        if (memberId != null) {
            likedProjectId = likedProjectRepository.findAllByMemberId(memberId).stream()
                    .map(likedProject -> likedProject.getProject().getId())
                    .collect(Collectors.toList());
        } else {
            likedProjectId = new ArrayList<>();  // null인 경우 빈 리스트로 초기화
        }

        List<ProjectBoxHostDTO> dtoList = result.getContent().stream()
                .map(project -> {
                    AdminApproval adminApproval = adminApprovalService.findByProjectId(project.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Approval not found for projectId: " + project.getId()));

                    return ProjectBoxHostDTO.builder()
                            .id(project.getId())
                            .title(project.getTitle())
                            .description(project.getDescription())
                            .thumbnailUrl(project.getThumbnailUrl())
                            .fundsReceive(project.getFundsReceive())
                            .targetFunding(project.getTargetFunding())
                            .nickName(project.getMember().getNickname())
                            .endDate(project.getEndDate())
                            .Liked(likedProjectId.contains(project.getId()))  // 좋아요 여부는 기본적으로 false
                            .approval(adminApproval.getApproval())
                            .build();
                })
                .collect(Collectors.toList());

        return PageResponseDTO.<ProjectBoxHostDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .dtoList(dtoList)
                .total((int) result.getTotalElements())  // 전체 프로젝트 수를 설정
                .build();

    }

    @Override
    public List<WritingProjectDTO> getWritingProjectDTO(Long memberId) {
        List<Project> result = projectRepository.findAllByMemberIdAndSubmitAtIsNullAndDeletedAtIsNull(memberId);

        return result.stream()
                .map(project -> WritingProjectDTO.builder()
                        .id(project.getId())
                        .title(project.getTitle())
                        .build())
                .collect(Collectors.toList());

    }

    @Override
    public ProjectDetailHostDTO readProjectDetailHost(Long projectId, Long memberId) {
        projectValidator.validateMemberIsOrganizer(securityContextUtil.getAuthenticatedMemberId(), projectId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        final List<Long> likedProjectId;
        if (memberId != null) {
            likedProjectId = likedProjectRepository.findAllByMemberId(memberId).stream()
                    .map(likedProject -> likedProject.getProject().getId())
                    .collect(Collectors.toList());
        } else {
            likedProjectId = new ArrayList<>();  // null인 경우 빈 리스트로 초기화
        }

        List<ProjectImage> projectImages = projectImageRepository.findAllByProjectIdOrderByOrd(projectId);
        List<String> productImages = projectImages.stream()
                .filter(projectImage -> projectImage.getImageType().getImageType().equals("product"))
                .map(ProjectImage::getUrl)
                .collect(Collectors.toList());

        List<Tag> tags = project.getTags();
        List<String> tagDTOs = tags.stream()
                .map(Tag::getName)
                .collect(Collectors.toList());

        AdminApproval adminApproval = adminApprovalService.findByProjectId(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Approval not found for projectId: " + project.getId()));

        // 좋아요 여부는 기본적으로 false

        return ProjectDetailHostDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .fundsReceive(project.getFundsReceive())
                .targetFunding(project.getTargetFunding())
                .category(project.getCategory() == null ? null : project.getCategory().getName())
                .nickName(project.getMember().getNickname())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .supporterCnt(project.getSupporterCnt())
                .approval(adminApproval.getApproval())
                .rejectMessage(adminApproval.getApprovalText())
                .likerCnt(project.getLikeCnt())
                .Liked(likedProjectId.contains(project.getId()))  // 좋아요 여부는 기본적으로 false
                .productImages(productImages)
                .tags(tagDTOs)
                .build();
    }

    @Override
    public ProjectResponseDetailDTO readProjectDetail(Long projectId, Long memberId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        final List<Long> likedProjectId;
        if (memberId != null) {
            likedProjectId = likedProjectRepository.findAllByMemberId(memberId).stream()
                    .map(likedProject -> likedProject.getProject().getId())
                    .collect(Collectors.toList());
        } else {
            likedProjectId = new ArrayList<>();  // null인 경우 빈 리스트로 초기화
        }

        // deletedAt이 null이 아니면 예외를 발생시켜서 처리
        if (project.getDeletedAt() != null) {
            throw new RuntimeException("삭제된 프로젝트입니다.");
        } else {

            List<ProjectImage> projectImages = projectImageRepository.findAllByProjectId(projectId);

            List<String> productImages = projectImages.stream()
                    .filter(projectImage -> projectImage.getImageType().getImageType().equals("product"))

                    .map(ProjectImage::getUrl)
                    .collect(Collectors.toList());

            List<String> descriptionImages = projectImages.stream()
                    .filter(projectImage -> projectImage.getImageType().getImageType().equals("description"))
                    .map(ProjectImage::getUrl)
                    .collect(Collectors.toList());

            List<Tag> tags = project.getTags();
            List<String> tagDTOs = tags.stream()
                    .map(Tag::getName)
                    .collect(Collectors.toList());

            project.setViewCnt(project.getViewCnt() + 1);

            // 좋아요 여부는 기본적으로 false

            return ProjectResponseDetailDTO.builder()
                    .id(project.getId())
                    .title(project.getTitle())
                    .description(project.getDescription())
                    .descriptionDetail(project.getDescriptionDetail())
                    .fundsReceive(project.getFundsReceive())
                    .targetFunding(project.getTargetFunding())
                    .category(project.getCategory() == null ? null : project.getCategory().getName())
                    .nickName(project.getMember() == null ? null : project.getMember().getNickname())
                    .startDate(project.getStartDate())
                    .endDate(project.getEndDate())
                    .supporterCnt(project.getSupporterCnt())
                    .likeCnt(project.getLikeCnt())
                    .thumbnailUrl(project.getThumbnailUrl())
                    .productImages(productImages)
                    .Liked(likedProjectId.contains(project.getId()))  // 좋아요 여부는 기본적으로 false
                    .descriptionImages(descriptionImages)
                    .tags(tagDTOs)
                    .build();

        }

    }

    @Override
    public void delProject(Long projectId) {
        projectValidator.validateMemberIsOrganizer(securityContextUtil.getAuthenticatedMemberId(), projectId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        tagService.delProjectFromTags(project);

        boolean delImg = imgService.deleteImageFiles(projectImageRepository.findAllByProjectId(projectId));
        project.setThumbnailUrl(null);

        docService.deleteDocFiles(projectDocumentRepository.findAllByProjectId(projectId));

        if (delImg) {
            project.setDeletedAt(LocalDateTime.now());
            projectRepository.save(project);
        }

    }

    @Override
    public Long register(Long memberId,
                         ProjectDetailDTO projectDetailDTO,
                         boolean submit,
                         List<MultipartFile> productImages,
                         List<MultipartFile> descriptionImages,
                         List<MultipartFile> docs) {

        List<Tag> tags = tagService.registerTags(projectDetailDTO.getTags());

        Member member = memberService.getById(memberId);

        // 1. 프로젝트 생성 및 저장 (ID 생성)
        Project project = Project.builder()
                .member(member)
                .tags(tags)
                .category(categoryRepository.findByName(projectDetailDTO.getCategory()))
                .title(projectDetailDTO.getTitle())
                .description(projectDetailDTO.getDescription())
                .descriptionDetail(projectDetailDTO.getDescriptionDetail())
                .startDate(projectDetailDTO.getStartDate())
                .endDate(projectDetailDTO.getEndDate())
                .targetFunding(projectDetailDTO.getTargetFunding())
                .fundsReceive(0L)
                .supporterCnt(0L)  // 기본값 0
                .viewCnt(0L)       // 기본값 0
                .likeCnt(0L)       // 기본값 0
                .thumbnailUrl("")  // 기본값은 빈 문자열로 설정
                .submitAt(submit ? LocalDateTime.now() : null)  // 제출 시간 설정
                .build();


        // 프로젝트를 저장해 ID를 생성
        project = projectRepository.save(project);
        final Long projectId = project.getId();


        // 3. 태그 설정
        tags = tagService.addProjectToTags(projectDetailDTO.getTags(), projectId);
        project.setTags(tags);  // 프로젝트에 태그 추가
        return project.getId();

    }


    // T를 제너릭 타입으로 선언하고, 그 타입은 getUrl() 메서드를 가진 객체로 제한
    protected <T> int isObjectInUpdateFiles(List<MetaDTO> files, T object, Function<T, String> urlGetter) {
        if (files != null) {
            for (MetaDTO file : files) {
                if (file.getUrl().equals(urlGetter.apply(object))) {  // 제너릭으로 받아온 객체의 URL과 비교
                    return file.getOrd();
                }
            }
        }
        return -1;
    }

    // 제너릭 타입 T를 사용하도록 수정 (BiConsumer로 변경)
    protected <T> List<T> updateFiles(List<MetaDTO> files, List<T> objects,
                                      Function<T, String> urlGetter,
                                      BiConsumer<T, Integer> ordSetter) {
        List<T> deleteList = new ArrayList<>();
        if (objects != null) {
            for (T object : objects) {
                int isObjInUpdateFiles = isObjectInUpdateFiles(files, object, urlGetter);
                if (isObjInUpdateFiles != -1) {
                    ordSetter.accept(object, isObjInUpdateFiles);  // ordSetter가 이제 두 개의 파라미터를 받음
                } else {
                    deleteList.add(object);
                }
            }
        }
        return deleteList;
    }


    protected List<FileDTO> fileInputMeta(List<MetaDTO> filesMeta, List<MultipartFile> files) {
        if (filesMeta == null || files == null) {
            return null;
        }

        List<FileDTO> result = new ArrayList<>();
        // productImagesMeta와 productImages 리스트가 동일한 크기인지 확인
        if (filesMeta.size() == files.size()) {
            // 각 FileDTO 객체의 file 필드에 같은 인덱스의 MultipartFile을 할당
            for (int i = 0; i < filesMeta.size(); i++) {
                FileDTO fileDTO = new FileDTO();
                // FileDTO의 file 필드에 MultipartFile을 설정
                fileDTO.setFile(files.get(i));
                fileDTO.setUrl(filesMeta.get(i).getUrl());
                fileDTO.setOrd(filesMeta.get(i).getOrd());
                result.add(fileDTO);
            }
        } else {
            // 크기가 다르면 오류 처리
            throw new IllegalArgumentException("File metadata and actual file list sizes do not match");
        }
        return result;

    }

    @Override
    public Long updateProject(ProjectDetailDTO projectDetailDTO,
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
    ) {

        List<FileDTO> productImagesFile = fileInputMeta(productImagesMeta, productImages);
        List<FileDTO> descriptionImagesFile = fileInputMeta(descriptionImagesMeta, descriptionImages);
        List<FileDTO> docsFile = fileInputMeta(docsMeta, docs);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        tagService.delProjectFromTags(project);
        List<Tag> newTags = tagService.addProjectToTags(projectDetailDTO.getTags(), projectId);


        List<ProjectImage> projectImages = projectImageRepository.findAllByProjectId(projectId);

        List<ProjectImage> projectProductImages = projectImages.stream()
                .filter(image -> image.getImageType().getImageType().equals("product") || image.getImageType().getImageType().equals("thumbnail"))
                .collect(Collectors.toList());

        List<ProjectImage> projectDescriptionImages = projectImages.stream()
                .filter(image -> image.getImageType().getImageType().equals("description"))
                .collect(Collectors.toList());


        List<ProjectImage> delProductImages = updateFiles(updateProductImage, projectProductImages, ProjectImage::getUrl, ProjectImage::setOrd);
        List<ProjectImage> delDescriptionImages = updateFiles(updateDescriptionImage, projectDescriptionImages, ProjectImage::getUrl, ProjectImage::setOrd);

        List<ProjectDocument> projectDocs = projectDocumentRepository.findAllByProjectId(projectId);

        List<ProjectDocument> delDocs = updateFiles(updateDocs, projectDocs, ProjectDocument::getUrl, ProjectDocument::setOrd);

        imgService.deleteImageFiles(delProductImages);
        imgService.deleteImageFiles(delDescriptionImages);
        docService.deleteDocFiles(delDocs);

        if (productImagesFile != null && !productImagesFile.isEmpty()) {
            imgService.saveImages(project, productImagesFile, 1L);
        }

        if (descriptionImagesFile != null && !descriptionImagesFile.isEmpty()) {
            imgService.saveImages(project, descriptionImagesFile, 3L);
        }

        ProjectImage thumbnailImage = projectImageRepository.findByProject_IdAndOrdAndImageType_Id(projectId, 1, 1L);
        if (thumbnailImage != null) {
            project.setThumbnailUrl(imgService.saveThumbnailImages(project, thumbnailImage));
        }

        if (docsFile != null && !docsFile.isEmpty()) {
            docService.saveDocs(project, docsFile);
        }

        project.setTags(newTags);
        project.setCategory(categoryRepository.findByName(projectDetailDTO.getCategory()));
        project.setTitle(projectDetailDTO.getTitle());
        project.setDescription(projectDetailDTO.getDescription());
        project.setDescriptionDetail(projectDetailDTO.getDescriptionDetail());
        project.setStartDate(projectDetailDTO.getStartDate());
        project.setEndDate(projectDetailDTO.getEndDate());
        project.setTargetFunding(projectDetailDTO.getTargetFunding());
        project.setSubmitAt(submit ? LocalDateTime.now() : null);  // 제출 시간 설정

        if (submit) adminApprovalService.submitProject(project);

        return project.getId();
    }

    @Override
    public Project findById(Long id) {
        Optional<Project> result = projectRepository.findById(id);

        return result.orElseThrow();
    }

    @Override
    public List<?> getDailySupportingByProjectId(Long projectId) {
        return supportingProjectService.getDailySupportingByProjectId(projectId);
    }
}
