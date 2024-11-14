package org.eightbit.damdda.order.repository;

import org.eightbit.damdda.order.domain.SupportingProject;
import org.eightbit.damdda.project.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportingProjectRepository extends JpaRepository<SupportingProject, Long> {
    // 특정 프로젝트에 대한 후원자 수를 카운트
    long countByProject(Project project);

    List<SupportingProject> findAllByUser_Id(Long userId);

    // 일별 후원액 가져오는 쿼리
    @Query("SELECT pr.supportedAt, SUM(pa.projectPackage.packagePrice) " +
            "FROM SupportingProject pr INNER JOIN SupportingPackage pa " +
            "ON pr.supportingProjectId = pa.supportingProject.supportingProjectId " +
            "WHERE pr.project.id = :projectId GROUP BY pr.supportedAt")
    List<?> getDailySupportingByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT sp FROM SupportingProject sp WHERE sp.payment.paymentId=:paymentId")
    SupportingProject findByPaymentId(@Param("paymentId") Long paymentId);

}