package org.eightbit.damdda.project.repository;

import org.eightbit.damdda.project.domain.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ProjectRepository extends JpaRepository<Project, Long>, ProjectRepositoryCustom {

    @Modifying
    @Query("update Project p set p.fundsReceive = p.fundsReceive + :fundsReceive ,p.supporterCnt = p.supporterCnt+:increment WHERE  p.id=:projectId")
    void updateProjectStatus(@Param("fundsReceive") Long fundsReceive, @Param("projectId") Long projectId, @Param("increment") Long increment);

    @Query("select p from Project p where p.member.id = :memberId and p.deletedAt is null and p.submitAt is NOT null")
    Page<Project> listOfProjectBoxHost(@Param("memberId") Long memberId, Pageable pageable);

    List<Project> findAllByMemberIdAndSubmitAtIsNullAndDeletedAtIsNull(Long memberId);

    @Query("SELECT p FROM Project p "
            + "WHERE p.deletedAt IS NULL "  // 삭제된 항목 필터
            + "AND (:category IS NULL OR :category = '전체' OR p.category.name = :category) "  // 카테고리 필터
            + "AND (:search IS NULL OR p.title LIKE %:search% "
            + "OR p.description LIKE %:search% "
            + "OR p.descriptionDetail LIKE %:search% "
            + "OR EXISTS (SELECT t FROM Tag t WHERE t MEMBER OF p.tags AND t.name LIKE %:search%)) "  // 검색어 필터 (태그 포함)
            + "AND (:progress IS NULL OR "
            + "     (:progress = 'all') OR "
            + "     (:progress = 'ongoing' AND current_timestamp BETWEEN p.startDate AND p.endDate) OR "  // 진행 중 필터
            + "     (:progress = 'upcoming' AND p.startDate > current_timestamp) OR "  // 예정 필터
            + "     (:progress = 'completed' AND p.endDate < current_timestamp)) " // 완료된 필터
            + "ORDER BY (p.fundsReceive / p.targetFunding) DESC"
    )
    List<Project> findAllSortedByFundingRatio(@Param("category") String category,
                                              @Param("search") String search,
                                              @Param("progress") String progress);

    @Query("SELECT p.fundsReceive, p.targetFunding, p.supporterCnt, p.startDate, p.endDate " +
            "FROM Project p WHERE p.id = :projectId")
    Object[] findProjectDetailsForStatisticsByProjectId(@Param("projectId") Long projectId);
    // 프로젝트의 통계 정보를 조회하는 쿼리
    // - p.fundsReceive: 현재까지 받은 총 후원 금액
    // - p.targetFunding: 목표 후원 금액
    // - p.supporterCnt: 후원자 수
    // - p.startDate: 프로젝트 시작일
    // - p.endDate: 프로젝트 종료일
    // 특정 프로젝트 ID에 해당하는 정보를 조회하여 Object[] 배열로 반환
    // 반환되는 배열의 순서는 [fundsReceive, targetFunding, supporterCnt, startDate, endDate]

}