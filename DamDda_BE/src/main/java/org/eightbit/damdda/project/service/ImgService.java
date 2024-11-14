package org.eightbit.damdda.project.service;

import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.domain.ProjectImage;
import org.eightbit.damdda.project.dto.FileDTO;

import java.util.List;

public interface ImgService {
    boolean deleteImageFiles(List<ProjectImage> images);

    String saveThumbnailImages(Project project, ProjectImage thumbnailImage);

    void saveImages(Project project, List<FileDTO> productImages, Long ImageTypeId);
}
