package org.eightbit.damdda.order.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.order.dto.OrderDTO;
import org.eightbit.damdda.order.dto.ProjectStatisticsDTO;
import org.eightbit.damdda.order.service.OrderService;
import org.eightbit.damdda.security.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor

@SessionAttributes("supportingPackage")
@Log4j2
@RequestMapping("/order")

public class OrderController {

    private final OrderService orderService;

    //주문 생성
    @PostMapping("/create")
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO, @AuthenticationPrincipal User user) {
        orderDTO.getSupportingProject().getUser().setId(user.getMemberId());
        OrderDTO createdOrder = orderService.createOrder(orderDTO);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    // 결제 성공창 - 결제 정보 불러오기
    @GetMapping("/details/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        Optional<OrderDTO> orderDTOOptional = orderService.getOrderById(orderId);
        return orderDTOOptional.map(orderDTO -> new ResponseEntity<>(orderDTO, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    //SupportedProjects - 주문 정보들 모두 가져오기
    @GetMapping("/supportingprojects")
    public List<OrderDTO> getOrdersByUserId(@AuthenticationPrincipal User user) {
        Long userId = user.getMemberId();
        return orderService.getOrdersWithPaymentByUserId(userId);
    }

    // PaymentSuccess.jsx - 결제 완료
    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updatePaymentStatus(@PathVariable Long orderId, @RequestBody Map<String, String> requestBody) {
        try {
            String status = requestBody.get("paymentStatus");
            orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok("Payment status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update payment status");
        }
    }

    @PutMapping("/{paymentId}/cancel")
    public ResponseEntity<String> cancelPayment(@PathVariable Long paymentId, @RequestBody Map<String, Object> requestBody) {
        try {
            String status = (String) requestBody.get("paymentStatus");
            orderService.cancelPayment(paymentId, status);
            return ResponseEntity.ok("Payment canceled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to cancel payment");
        }
    }

    // Supporting 모든 주문 정보 - 모든 주문 정보를 가져오는 API 엔드포인트
    @GetMapping("/all")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    //프로젝트 id 가져오기
    @GetMapping("/user/project")
    public ResponseEntity<Long> getUserProject(@AuthenticationPrincipal User user) {
        Long memberId = user.getMemberId();
        Long projectId = orderService.getUserProjectId(memberId);
        if (projectId != null) {
            return new ResponseEntity<>(projectId, HttpStatus.OK); // projectId만 반환
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 프로젝트가 없을 경우 404 반환
        }
    }

    // 프로젝트의 통계 정보를 조회하는 엔드포인트
    // - projectId에 해당하는 프로젝트의 시작일, 마감일, 달성률, 총 후원 금액, 후원자 수, 남은 기간을 반환
    @GetMapping("/statistics/{projectId}")
    public ResponseEntity<ProjectStatisticsDTO> getProjectStatistics(@PathVariable Long projectId) {
        return ResponseEntity.ok(orderService.getProjectStatistics(projectId));
    }

    // 엑셀 파일을 생성하여 S3에 업로드하고, presigned URL을 반환하는 엔드포인트
    // - projectId에 해당하는 후원자 데이터를 엑셀 파일로 생성하고 S3에 업로드
    // - 생성된 엑셀 파일에 대한 presigned URL을 반환
    @GetMapping("/{projectId}/supporters/excel")
    public ResponseEntity<String> generateAndGetSupportersExcel(@PathVariable Long projectId) throws IOException {
        return ResponseEntity.ok(orderService.generateUploadAndGetPresignedUrlForSupportersExcel(projectId));
    }

    // 후원자 데이터를 JSON 형식으로 반환하는 엔드포인트
    // - projectId에 해당하는 프로젝트의 후원자 정보를 JSON 형식의 리스트로 반환
    @GetMapping("/{projectId}/supporters")
    public ResponseEntity<List<Map<String, Object>>> getSupportersData(@PathVariable Long projectId) {
        return ResponseEntity.ok(orderService.getSupportersData(projectId));
    }


}