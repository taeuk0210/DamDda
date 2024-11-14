package org.eightbit.damdda.project.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.domain.ProjectDocument;
import org.eightbit.damdda.project.dto.FileDTO;
import org.eightbit.damdda.project.repository.ProjectDocumentRepository;
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
public class DocServiceImpl implements DocService {

    private final ProjectDocumentRepository projectDocumentRepository;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public boolean deleteDocFiles(List<ProjectDocument> docs) {
        boolean result = true;
        // 첫 번째 파일의 폴더 경로를 추출
        if (!docs.isEmpty()) {
            for (ProjectDocument doc : docs) {
                String filePath = doc.getUrl().replace("files", "");  // img.getUrl()이 상대 경로라 가정
                amazonS3.deleteObject(new DeleteObjectRequest(bucketName, filePath));
                projectDocumentRepository.delete(doc);
            }
        }
        return result;  // 파일이 존재하지 않으면 false 반환
    }

    public void saveDocs(Project project, List<FileDTO> docs) {
       for (FileDTO doc : docs) {
            try {
                MultipartFile file = doc.getFile();
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                String s3Key = "projects/" + project.getId() + "/" + fileName;

                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentLength(doc.getFile().getSize());
                amazonS3.putObject(new PutObjectRequest(bucketName, s3Key, doc.getFile().getInputStream(), metadata));

                // 이미지 엔티티 저장
                ProjectDocument projectDocument = ProjectDocument.builder()
                        .project(project)
                        .url("files/projects/" + project.getId() + "/" + fileName)
                        .fileName(fileName)
                        .ord(doc.getOrd())
                        .build();

                projectDocumentRepository.save(projectDocument);

            } catch (IOException e) {
                // 예외 처리 로직 작성 (로그 기록 또는 사용자에게 알림 등)
                throw new RuntimeException(e);
            }
        }

    }
}

