package org.eightbit.damdda.order.repository;

import org.eightbit.damdda.order.domain.Order;
import org.eightbit.damdda.order.domain.SupportingProject;
import org.eightbit.damdda.project.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // userId를 기반으로 주문 목록을 조회하는 메서드
    List<Order> findAllBySupportingProject_User_Id(Long userId);

    Optional<Order> findById(Long orderId);

    List<Order> findAllBySupportingProject(SupportingProject supportingProject);

    // SupportingSearch - 모든 주문 정보를 가져오는 메서드
    List<Order> findAll();

    // 프로젝트 id 가져오는 로직
    @Query("SELECT p FROM Project p WHERE p.member.id = :memberId")
    List<Project> findProjectsByMemberId(@Param("memberId") Long memberId);

    @Query("SELECT o FROM Order o WHERE o.payment.paymentId=:paymentId")
    Order findByPaymentId(@Param("paymentId") Long paymentId);

    /**
     * Fetches all orders associated with the given project ID.
     *
     * @param projectId the ID of the project
     * @return a list of orders for the specified project
     */
    List<Order> findAllBySupportingProject_Project_Id(Long projectId);


}