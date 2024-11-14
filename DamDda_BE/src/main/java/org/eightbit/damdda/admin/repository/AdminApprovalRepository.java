package org.eightbit.damdda.admin.repository;

import org.eightbit.damdda.admin.domain.AdminApproval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * AdminApproval 엔티티에 대한 JPA 리포지토리 인터페이스.
 * 승인 기록에 대한 데이터베이스 접근 로직을 처리합니다.
 */
public interface AdminApprovalRepository extends JpaRepository<AdminApproval, Long> {

    /**
     * 특정 프로젝트 ID로 승인 기록을 조회.
     *
     * @param projectId 프로젝트 고유 ID
     * @return 해당 프로젝트에 대한 승인 기록 (Optional)
     */
    Optional<AdminApproval> findByProjectId(Long projectId);

    /**
     * 특정 승인 상태에 해당하는 모든 승인 기록을 조회.
     *
     * @param approval 승인 상태 코드 (0: 대기, 1: 승인, 2: 거절)
     * @return 해당 승인 상태에 대한 승인 기록 리스트
     */
    List<AdminApproval> findAllByApproval(Integer approval);
}