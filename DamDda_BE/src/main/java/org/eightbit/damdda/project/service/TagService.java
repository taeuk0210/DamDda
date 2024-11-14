package org.eightbit.damdda.project.service;

import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.domain.Tag;
import org.eightbit.damdda.project.dto.TagDTO;

import java.util.List;

public interface TagService {
    List<Tag> registerTags(List<TagDTO> tags);

    String registerTag(String tagName);

    List<Tag> addProjectToTags(List<TagDTO> tagDTOs, Long projectId);

    String addProjectToTag(String tagName, Long projectId);

    Tag getTag(String tagName);

    List<Tag> delProjectFromTags(Project project);

    String delProjectFromTag(String tagName, Project project);
}
