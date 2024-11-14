package org.eightbit.damdda.admin.service.impl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.admin.domain.CarouselImage;
import org.eightbit.damdda.admin.dto.file.FileDTO;
import org.eightbit.damdda.admin.dto.file.FileUploadDTO;
import org.eightbit.damdda.admin.repository.CarouselImageRepository;
import org.eightbit.damdda.admin.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    @Value("${ncp.storage.upload.carousels}")
    private String uploadPathCarousels;
    @Value("${ncp.storage.upload.projects}")
    private String uploadPathProjects;
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    private final CarouselImageRepository carouselImageRepository;

    private final AmazonS3 amazonS3;


    @Override
    public List<FileDTO> uploadCarousel(FileUploadDTO fileUploadDTO) {

        if (fileUploadDTO.getFiles() != null) {
            final List<FileDTO> list = new ArrayList<>();

            fileUploadDTO.getFiles().forEach(multipartFile -> {
                String originalFilename = multipartFile.getOriginalFilename();
                String uuid = UUID.randomUUID().toString();
                String s3Key = uploadPathCarousels + "/" + uuid + "_" + originalFilename;

                try {
                    // Upload file to S3
                    ObjectMetadata metadata = new ObjectMetadata();
                    metadata.setContentLength(multipartFile.getSize());
                    amazonS3.putObject(new PutObjectRequest(bucketName, s3Key, multipartFile.getInputStream(), metadata));

                } catch (IOException e) {
                    e.printStackTrace();
                }

                list.add(FileDTO.builder()
                        .uuid(uuid)
                        .fileName(originalFilename)
                        .isImage(false).build());

                CarouselImage carouselImage = CarouselImage.builder()
                        .adminImageUrl("files/" + s3Key)
                        .build();
                carouselImageRepository.save(carouselImage);
            });
            return list;
        }
        return null;
    }
    @Override
    @Transactional
    public void modifyCarousel(List<String> fileNames) {
        fileNames.forEach(fileName -> {
            String s3Key = uploadPathCarousels + "/" + fileName;

            // Delete file from S3
            amazonS3.deleteObject(new DeleteObjectRequest(bucketName, s3Key));

            // Delete the record from the database
            carouselImageRepository.deleteById(
                    carouselImageRepository.findByAdminImageUrlContaining(fileName)
                            .orElseThrow()
                            .getId()
            );
        });
    }
    @Override
    public ResponseEntity<List<String>> getCarouselUrls() {
        List<CarouselImage> carouselList = carouselImageRepository.findAll();
        List<String> urlList = carouselList.stream()
                .map(CarouselImage::getAdminImageUrl) // 각 이미지의 URL을 가져옴
                .collect(Collectors.toList());
        return ResponseEntity.ok(urlList);
    }



    @Override
    public ResponseEntity<Resource> downloadResource(String fileType, Long projectId,
                                                     String fileName, boolean download) {
        String filePath = null;
        if (fileType != null) {
            filePath = uploadPathCarousels + "/" + fileName;
        } else {
            filePath = uploadPathProjects + "/" + projectId + "/" + fileName;
        }
        S3Object s3Object = amazonS3.getObject(new GetObjectRequest(bucketName, filePath));
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        Resource resource = new InputStreamResource(inputStream);

        if (!resource.exists()) {
            return ResponseEntity.notFound().build(); // 파일이 없을 경우 404 반환
        }

        HttpHeaders headers = new HttpHeaders();
        if (download) {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);
        }
        headers.add("Content-Type", s3Object.getObjectMetadata().getContentType());
        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }

}
