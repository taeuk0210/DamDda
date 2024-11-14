package org.eightbit.damdda.project.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.domain.ProjectImage;
import org.eightbit.damdda.project.domain.ProjectImageType;
import org.eightbit.damdda.project.dto.FileDTO;
import org.eightbit.damdda.project.repository.ProjectImageRepository;
import org.eightbit.damdda.project.repository.ProjectImageTypeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;


@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ImgServiceImpl implements ImgService {

    private final ProjectImageRepository projectImageRepository;
    private final ProjectImageTypeRepository projectImageTypeRepository;
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    private final AmazonS3 amazonS3;

    @Override
    public boolean deleteImageFiles(List<ProjectImage> images) {
        boolean result = true;
        // 첫 번째 파일의 폴더 경로를 추출
        if (!images.isEmpty()) {
            for (ProjectImage img : images) {
                String filePath = img.getUrl().replace("files", "");  // img.getUrl()이 상대 경로라 가정
                amazonS3.deleteObject(new DeleteObjectRequest(bucketName, filePath));
                projectImageRepository.delete(img);
            }
        }

        return result;  // 파일이 존재하지 않으면 false 반환
    }

    @Override
    public String saveThumbnailImages(Project project, ProjectImage thumbnailImage) {
        try {
            // ProjectImage 엔티티에서 이미지 파일 경로(URL)를 가져옴
            String fileName = thumbnailImage.getFileName();
            String filePath = "projects/" + project.getId() + "/" + fileName;
            S3Object s3Object = amazonS3.getObject(new GetObjectRequest(bucketName, filePath));
            S3ObjectInputStream inputStream = s3Object.getObjectContent();
            String thumbnailFileName = "thumbnail_" + fileName;
            String s3Key = "projects/" + project.getId() + "/" + thumbnailFileName;

            amazonS3.putObject(new PutObjectRequest(bucketName, s3Key, inputStream, s3Object.getObjectMetadata()));
            ProjectImageType imageType = projectImageTypeRepository.findById(2L).orElse(null);

            ProjectImage newThumbnailImage = ProjectImage.builder()
                    .project(project)
                    .url("files/projects/" + project.getId() + "/" + thumbnailFileName)
                    .fileName(thumbnailFileName)
                    .ord(0)
                    .imageType(imageType)
                    .build();
            projectImageRepository.save(newThumbnailImage);


            // 이후 repository를 통해 projectImage를 저장 가능
            projectImageRepository.save(newThumbnailImage);
            return newThumbnailImage.getUrl();
        } catch (Exception e) {
            // 예외 처리 로직 작성 (로그 기록 또는 사용자에게 알림 등)
            throw new RuntimeException(e);
        }
    }


    @Override
    public void saveImages(Project project, List<FileDTO> Images, Long ImageTypeId) {
        for (FileDTO image : Images) {
            try {
                MultipartFile file = image.getFile();
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                String s3Key = "projects/" + project.getId() + "/" + fileName;

                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentLength(image.getFile().getSize());
                amazonS3.putObject(new PutObjectRequest(bucketName, s3Key, image.getFile().getInputStream(), metadata));

                // 이미지 타입 설정 (썸네일과 일반 이미지)
                ProjectImageType imageType = projectImageTypeRepository.findById(ImageTypeId).orElse(null);

                // 이미지 엔티티 저장
                ProjectImage projectImage = ProjectImage.builder()
                        .project(project)
                        .url("files/projects/" + project.getId() + "/" + fileName)
                        .fileName(fileName)
                        .ord(image.getOrd())
                        .imageType(imageType)
                        .build();
                projectImageRepository.save(projectImage);
            } catch (IOException e) {
                // 예외 처리 로직 작성 (로그 기록 또는 사용자에게 알림 등)
                throw new RuntimeException(e);
            }
        }
    }
}