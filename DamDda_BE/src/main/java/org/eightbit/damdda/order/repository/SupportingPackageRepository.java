package org.eightbit.damdda.order.repository;

import org.eightbit.damdda.order.domain.SupportingPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface SupportingPackageRepository extends JpaRepository<SupportingPackage, Long> {

    /**
     * 특정 프로젝트에 대한 지원 날짜별 총 패키지 금액을 계산합니다.
     *
     * @param projectId 조회할 프로젝트의 ID
     * @return 지원 날짜(supportedAt)별로 그룹화된 총 패키지 금액의 리스트
     *         각 배열의 첫 번째 요소는 지원 날짜, 두 번째 요소는 총 패키지 금액입니다.
     */
    @Query("SELECT spProj.supportedAt, SUM(pp.packagePrice * sp.packageCount) " + // 지원 날짜와 패키지 금액 합계를 선택
            "FROM SupportingPackage sp " + // SupportingPackage 엔티티를 기준으로 쿼리 시작
            "JOIN sp.supportingProject spProj " + // SupportingPackage와 SupportingProject 조인
            "JOIN spProj.payment p " + // SupportingProject와 Payment 조인
            "JOIN spProj.project proj " + // SupportingProject와 Project 조인
            "JOIN sp.projectPackage pp " + // SupportingPackage와 ProjectPackage 조인
            "WHERE proj.id = :projectId " + // 특정 프로젝트 ID에 해당하는 데이터만 필터링
            "AND p.paymentStatus = '결제 완료' " + // 결제 상태가 '결제 완료'인 항목만 필터링
            "GROUP BY spProj.supportedAt " + // 지원 날짜(supportedAt)별로 그룹화
            "ORDER BY spProj.supportedAt") // 지원 날짜 순으로 결과 정렬
    List<Object[]> findTotalPackagePriceByProjectIdGroupedByDate(@Param("projectId") Long projectId);

    Set<SupportingPackage> findByOrder_OrderId(@Param("orderId") Long orderId);
}