package org.eightbit.damdda.order.service;

import org.eightbit.damdda.order.dto.OrderDTO;
import org.eightbit.damdda.order.dto.ProjectStatisticsDTO;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface OrderService {
    //주문 저장
    @Transactional
    OrderDTO createOrder(OrderDTO orderDTO);

    // 특정 주문 정보 가져오기 (orderId로 조회)
    Optional<OrderDTO> getOrderById(Long orderId);

    // 사용자의 모든 주문 정보 및 결제 정보 가져오기
    List<OrderDTO> getOrdersWithPaymentByUserId(Long userId);

    void updateOrderStatus(Long orderId, String paymentStatus);

    String cancelPayment(Long paymentId, String paymentStatus);

    //SupportingProject - 모든 주문 정보를 가져오는 서비스 메서드
    List<OrderDTO> getAllOrders();

    //member id를 통해 프로젝트 id 가져오기
    Long getUserProjectId(Long memberId);

    /**
     * 프로젝트 통계 정보를 조회합니다.
     *
     * @param projectId 조회할 프로젝트의 ID
     * @return ProjectStatisticsDTO 객체, 프로젝트의 통계 정보가 포함됩니다.
     * @throws IllegalStateException 프로젝트 세부 정보를 찾을 수 없는 경우
     * @throws IllegalArgumentException 프로젝트가 존재하지 않거나, 사용자가 해당 프로젝트의 주최자가 아닌 경우
     */
    ProjectStatisticsDTO getProjectStatistics(Long projectId);

    /**
     * 주어진 프로젝트 ID에 대한 후원자 데이터를 기반으로 엑셀 파일을 생성하고,
     * 생성된 파일을 S3 버킷에 업로드한 후 presigned URL을 반환합니다.
     *
     * @param projectId 엑셀 파일을 생성할 대상 프로젝트의 ID
     * @return 생성된 엑셀 파일의 presigned URL (다운로드 링크)
     * @throws IOException 파일 생성 또는 업로드 중 오류가 발생한 경우
     */
    String generateUploadAndGetPresignedUrlForSupportersExcel(Long projectId) throws IOException;

    /**
     * 주어진 프로젝트 ID에 해당하는 후원자 데이터를 조회하여
     * 엑셀 파일 생성을 위한 데이터 형식으로 반환합니다.
     *
     * @param projectId 후원자 데이터를 조회할 대상 프로젝트의 ID
     * @return 후원자 데이터를 저장한 리스트 (각 항목은 맵 형식으로 구성)
     * @throws IllegalArgumentException 프로젝트 ID가 null인 경우
     * @throws IllegalStateException 유효하지 않은 사용자 권한 또는 데이터 조회 오류가 발생한 경우
     */
    List<Map<String, Object>> getSupportersData(Long projectId);

}