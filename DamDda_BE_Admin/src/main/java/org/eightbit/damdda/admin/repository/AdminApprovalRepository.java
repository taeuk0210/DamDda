package org.eightbit.damdda.admin.repository;


import org.eightbit.damdda.admin.domain.AdminApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AdminApprovalRepository extends JpaRepository<AdminApproval, Long> {
    @Query("SELECT a FROM AdminApproval a WHERE a.project.id = :projectId")
    Optional<AdminApproval> findByProjectId(@Param("projectId")Long projectId);
}
