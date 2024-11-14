package org.eightbit.damdda.project.repository.search;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.JPQLQuery;
import org.eightbit.damdda.admin.domain.QAdminApproval;
import org.eightbit.damdda.admin.dto.ProjectTitleDTO;
import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.domain.QProject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;
import java.util.stream.Collectors;

public class ProjectSearchImpl extends QuerydslRepositorySupport implements ProjectSearch {
    public ProjectSearchImpl() {
        super(Project.class);
    }

    @Override
    public Page<ProjectTitleDTO> findByApproval(Integer approval, Pageable pageable) {
        QProject project = QProject.project;
        QAdminApproval adminApproval = QAdminApproval.adminApproval;

        JPQLQuery<Project> projectJPQLQuery = from(project);
        projectJPQLQuery.leftJoin(adminApproval).on(adminApproval.project.eq(project));
        if (approval != null) {
            BooleanBuilder booleanBuilder = new BooleanBuilder();
            booleanBuilder.and(adminApproval.approval.eq(approval));
            projectJPQLQuery.where(booleanBuilder);
        }

        getQuerydsl().applyPagination(pageable, projectJPQLQuery);

        JPQLQuery<Tuple> tupleJPQLQuery = projectJPQLQuery.select(
                project.id, project.title, project.member.name,
                project.thumbnailUrl, adminApproval.approval);
        List<Tuple> tupleList = tupleJPQLQuery.fetch();
        List<ProjectTitleDTO> dtoList = tupleList.stream()
                .map(tuple -> {
                    ProjectTitleDTO dto = ProjectTitleDTO.builder()
                            .projectId(tuple.get(0, Long.class))
                            .title(tuple.get(1, String.class))
                            .organizer(tuple.get(2, String.class))
                            .thumbnailUrl(tuple.get(3, String.class))
                            .approval(tuple.get(4, Integer.class))
                            .build();
                    return dto;
                }).collect(Collectors.toList());
        long total = projectJPQLQuery.fetchCount();
        return new PageImpl<>(dtoList, pageable, total);

    }

}
