package org.eightbit.damdda.project.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/files/projects")
@Log4j2
@RequiredArgsConstructor
public class FileApiController {

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    private final AmazonS3 amazonS3;

    @GetMapping("/{projectId}/{fileName:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String projectId, @PathVariable String fileName) {
        String filePath = "projects/" + projectId + "/" + fileName;

        S3Object s3Object = amazonS3.getObject(new GetObjectRequest(bucketName, filePath));
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        Resource resource = new InputStreamResource(inputStream);

        if (!resource.exists()) {
            return ResponseEntity.notFound().build(); // 파일이 없을 경우 404 반환
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", s3Object.getObjectMetadata().getContentType());
        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }

}