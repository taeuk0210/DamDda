package org.eightbit.damdda.admin.service;

import org.eightbit.damdda.admin.dto.file.FileDTO;
import org.eightbit.damdda.admin.dto.file.FileUploadDTO;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

import java.util.*;


public interface FileService {

    List<FileDTO> uploadCarousel(FileUploadDTO fileUploadDTO);
    ResponseEntity<List<String>> getCarouselUrls();
    ResponseEntity<Resource> downloadResource(String fileType, Long projectId, String fileName, boolean download);
    void modifyCarousel(List<String> fileNames);

}
