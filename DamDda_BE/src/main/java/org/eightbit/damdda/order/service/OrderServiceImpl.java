package org.eightbit.damdda.order.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.common.utils.cloud.S3Util;
import org.eightbit.damdda.common.utils.file.ExcelGenerator;
import org.eightbit.damdda.common.utils.validation.ProjectValidator;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.order.domain.*;
import org.eightbit.damdda.order.dto.OrderDTO;
import org.eightbit.damdda.order.dto.PaymentPackageDTO;
import org.eightbit.damdda.order.dto.PaymentRewardDTO;
import org.eightbit.damdda.order.dto.ProjectStatisticsDTO;
import org.eightbit.damdda.project.domain.PackageRewards;

import org.eightbit.damdda.project.domain.Project;
import org.eightbit.damdda.project.domain.ProjectPackage;
import org.eightbit.damdda.security.util.SecurityContextUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;


@Log4j2
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements  OrderService{

    private final org.eightbit.damdda.order.repository.OrderRepository orderRepository;
    private final org.eightbit.damdda.order.repository.DeliveryRepository deliveryRepository;
    private final org.eightbit.damdda.order.repository.PaymentRepository paymentRepository;
    private final org.eightbit.damdda.order.repository.SupportingProjectRepository supportingProjectRepository;
    private final org.eightbit.damdda.order.repository.SupportingPackageRepository supportingPackageRepository;
    private final org.eightbit.damdda.project.repository.ProjectRepository projectRepository;
    private final org.eightbit.damdda.member.repository.MemberRepository memberRepository;
    private final org.eightbit.damdda.project.repository.PackageRepository packageRepository;

    private final SecurityContextUtil securityContextUtil;
    private final ProjectValidator projectValidator;
    private final S3Util s3Util;
    private final ExcelGenerator excelGenerator;

    @Value("${s3.url.expiration.minutes}")
    private int s3UrlExpirationMinutes;

    //주문 저장
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @Transactional
    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        ObjectMapper objectMapper = new ObjectMapper();
        // 연관된 엔티티 생성 및 저장
        Delivery delivery = deliveryRepository.save(orderDTO.getDelivery());
        Payment payment = paymentRepository.save(orderDTO.getPayment());

        Long projectId = orderDTO.getSupportingProject().getProject().getId();  // Project 엔티티의 ID를 가져옴
        Project project=projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));

        Long userId = orderDTO.getSupportingProject().getUser().getId();  // User(Member) 엔티티의 ID를 가져옴

        Member member=memberRepository.getById(userId);

        SupportingProject supportingProject = SupportingProject.builder()
                .user(member)
                .project(project)
                .supportedAt(LocalDateTime.now())
                .payment(payment)
                .delivery(delivery)
                .build();
        supportingProjectRepository.save(supportingProject);

        // 여러 개의 SupportingPackage를 처리할 수 있도록 Set을 사용
        Set<SupportingPackage> supportingPackages = new HashSet<>();
        
        // Order 엔티티 생성 및 저장
        Order order = Order.builder()
                .delivery(delivery)
                .payment(payment)
                .supportingProject(supportingProject)
                .createdAt(LocalDateTime.now())
                .build();

        Order savedOrder=orderRepository.save(order);
        orderDTO.setOrderId(savedOrder.getOrderId());

        orderDTO.getPaymentPackageDTO().forEach((sp)-> {
            ProjectPackage projectPackage = packageRepository.findById(sp.getId()).orElseThrow(()->new RuntimeException("해당 패키지를 찾을 수 없습니다."));
            SupportingPackage supportingPackage;
            try {
                // 첫 번째 배열의 첫 번째 요소만 가져옵니다.
                supportingPackage = SupportingPackage.builder()
                        .packageCount(sp.getCount())
                        .OptionList(objectMapper.writeValueAsString(sp.getRewardList().stream().map(PaymentRewardDTO::getSelectOption)
                                        .filter(Objects::nonNull)
                                        .collect(Collectors.toList())
                        ))
                        .supportingProject(supportingProject)  // 어떤 프로젝트를 참조하는지 설정
                        .order(order)
                        .projectPackage(projectPackage)
                        .build();
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            supportingPackageRepository.save(supportingPackage);
            supportingPackages.add(supportingPackage);
        });

        return orderDTO;
    }

    // 특정 주문 정보 가져오기 (orderId로 조회)
    @Override
    public Optional<OrderDTO> getOrderById(Long orderId) {
        return orderRepository.findById(orderId).map(order -> {
            // Order 엔티티를 OrderDTO로 변환
            return OrderDTO.builder()
                    .delivery(order.getDelivery())  // 배송 정보
                    .payment(order.getPayment())    // 결제 정보
                    .supportingProject(order.getSupportingProject())  // 후원 프로젝트 정보
                    .paymentPackageDTO(packageEntityToDto(order.getSupportingPackage()))  // 선물 구성 정보
                    .build();
        });
    }

    // 사용자의 모든 주문 정보 및 결제 정보 가져오기
    @Override
    public List<OrderDTO> getOrdersWithPaymentByUserId(Long userId) {
        // userId로 SupportingProject 가져오기

        List<SupportingProject> supportingProjects = supportingProjectRepository.findAllByUser_Id(userId);

        // 각 후원 프로젝트에 속한 주문을 모두 조회
        return supportingProjects.stream()
                .flatMap(supportingProject -> orderRepository.findAllBySupportingProject(supportingProject).stream())
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void updateOrderStatus(Long orderId, String paymentStatus) {
        // 주문 ID로 주문을 조회
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        // 결제 상태 업데이트
        order.getSupportingProject().getPayment().setPaymentStatus(paymentStatus);
        //project의 후원자 수, 후원금액 업데이트
        Long fundsReceive = order.getSupportingPackage().stream().mapToLong(sp-> (long) sp.getPackageCount() *sp.getProjectPackage().getPackagePrice()).sum();
        projectRepository.updateProjectStatus(fundsReceive,order.getSupportingProject().getProject().getId(),1L);

        //package의 salesQuantity,
        order.getSupportingPackage().forEach(sp -> packageRepository.updateQuantities(sp.getPackageCount(),sp.getProjectPackage().getId()));

        orderRepository.save(order);  // 변경된 상태를 저장
    }

    @Transactional
    @Override
    public String cancelPayment(Long paymentId, String paymentStatus) {
        // paymentId로 결제를 찾아 해당 결제 정보를 가져옵니다.
        SupportingProject supportingProject = supportingProjectRepository.findByPaymentId(paymentId);
        if (supportingProject!=null) {
            // 결제 상태 업데이트
            if (supportingProject.getPayment() != null) {
                supportingProject.getPayment().setPaymentStatus(paymentStatus); // 결제 상태 업데이트
                supportingProjectRepository.save(supportingProject); // 변경된 상태를 저장
                Order order = orderRepository.findByPaymentId(paymentId);
                long fundsReceive = order.getSupportingPackage().stream().mapToLong(sp-> (long) sp.getPackageCount() *sp.getProjectPackage().getPackagePrice()).sum();
                fundsReceive = fundsReceive *-1L;
                projectRepository.updateProjectStatus(fundsReceive,order.getSupportingProject().getProject().getId(),-1L);
                //package의 salesQuantity,
                order.getSupportingPackage().forEach(sp ->{
                    Integer salesQunatity = sp.getPackageCount()*-1;
                    packageRepository.updateQuantities(salesQunatity,sp.getProjectPackage().getId());
                });
                return "결제 취소됨";
            } else {
                throw new IllegalArgumentException("Payment not found for this supporting project");
            }
        } else {
            throw new IllegalArgumentException("SupportingProject not found with id: " + paymentId);
        }

    }

    private OrderDTO convertToOrderDTO(Order order) {
        return OrderDTO.builder()
                .orderId(order.getOrderId())
                .delivery(order.getDelivery())
                .payment(order.getPayment())
                .supportingProject(order.getSupportingProject())
                .paymentPackageDTO(packageEntityToDto(order.getSupportingPackage()))
                .build();

    }

    //SupportingProject - 모든 주문 정보를 가져오는 서비스 메서드
    @Override
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(order -> {
            // Order 엔티티를 OrderDTO로 변환
            return OrderDTO.builder()
                    .delivery(order.getDelivery())  // 배송 정보
                    .payment(order.getPayment())    // 결제 정보
                    .supportingProject(order.getSupportingProject())  // 후원 프로젝트 정보
                    .paymentPackageDTO(packageEntityToDto(supportingPackageRepository.findByOrder_OrderId(order.getOrderId())))  // 선물 구성 정보
                    .build();
        }).collect(Collectors.toList());
    }

    //member id를 통해 프로젝트 id 가져오기
    @Override
    public Long getUserProjectId(Long memberId) {
        List<Project> projects = orderRepository.findProjectsByMemberId(memberId);
        if (!projects.isEmpty()) {
            return projects.get(0).getId(); // 첫 번째 프로젝트 ID 반환
        }
        return null; // 프로젝트가 없으면 null 반환
    }

    // 내가 진행한 프로젝트 후원 관련 통계 정보 조회
    @Override
    public ProjectStatisticsDTO getProjectStatistics(Long projectId) {
        // 프로젝트가 존재하는지 확인 (존재하지 않으면 예외 발생)
        validateProjectExistenceForProjectId(projectId);

        // 사용자가 해당 프로젝트의 주최자인지 검증
        projectValidator.validateMemberIsOrganizer(securityContextUtil.getAuthenticatedMemberId(), projectId);

        // 프로젝트의 세부 정보를 조회
        // projectDetails 배열에는 [fundsReceive, targetFunding, supporterCnt, startDate, endDate] 순서로 데이터가 담긴 내부 배열이 포함됨
        Object[] projectDetails = projectRepository.findProjectDetailsForStatisticsByProjectId(projectId);

        if (projectDetails == null || projectDetails.length == 0 || !(projectDetails[0] instanceof Object[])) {
            throw new IllegalStateException("프로젝트의 세부 정보를 찾을 수 없습니다.");
        }

        // 조회된 프로젝트가 여러개인 경우를 대비하여 배열 안에 배열을 리턴 받음
        Object[] detailsArray = (Object[]) projectDetails[0];

        if (detailsArray.length < 5) {
            throw new IllegalStateException("프로젝트의 세부 정보가 불완전합니다.");
        }

        // 일별 후원 금액 합계를 조회하고, 결과를 Map으로 변환
        // dailyFundings 맵은 각 날짜(LocalDate)와 해당 날짜의 총 후원 금액(Long)을 매핑함
        Map<LocalDate, Long> dailyFundings = supportingPackageRepository
                .findTotalPackagePriceByProjectIdGroupedByDate(projectId)
                .stream()
                .collect(Collectors.toMap(
                        result -> ((LocalDateTime) result[0]).toLocalDate(), // 후원 날짜를 LocalDate로 변환
                        result -> (Long) result[1], // 해당 날짜의 총 후원 금액
                        (existing, replacement) -> existing, // 중복 키가 있을 경우 기존 값을 유지
                        LinkedHashMap::new // 순서를 유지하기 위해 LinkedHashMap 사용
                ));

        // ProjectStatisticsDTO 객체를 빌드하여 반환
        // 각 필드는 detailsArray 배열의 데이터를 사용하여 초기화
        return ProjectStatisticsDTO.builder()
                .currentFundingReceived(((Number) detailsArray[0]).longValue()) // 현재 총 후원 금액
                .targetFundingGoal(((Number) detailsArray[1]).longValue())      // 목표 후원 금액
                .currentSupportersCount(((Number) detailsArray[2]).longValue()) // 현재 후원자 수
                .projectStartDate(((LocalDateTime) detailsArray[3]).toLocalDate()) // 프로젝트 시작일
                .projectEndDate(((LocalDateTime) detailsArray[4]).toLocalDate())   // 프로젝트 종료일
                .daysRemaining(Math.max(ChronoUnit.DAYS.between(LocalDate.now(), ((LocalDateTime) detailsArray[4]).toLocalDate()), 0)) // 남은 일수 계산
                .dailyFundings(dailyFundings) // 일별 후원 금액 정보
                .build();

    }

    // 후원자(배송, 후원, 주문 등) 정보 조회
    @Override
    public List<Map<String, Object>> getSupportersData(Long projectId) {
        validateProjectExistenceForProjectId(projectId);

        // 사용자가 해당 프로젝트의 주최자인지 검증
        projectValidator.validateMemberIsOrganizer(securityContextUtil.getAuthenticatedMemberId(), projectId);

        // 해당 프로젝트의 후원 주문 목록을 조회
        List<Order> orders = orderRepository.findAllBySupportingProject_Project_Id(projectId);
        List<Map<String, Object>> data = new ArrayList<>(orders.size());

        // 각 주문을 순회하면서 필요한 데이터를 수집
        for (Order order : orders) {
            Map<String, Object> rowData = new LinkedHashMap<>(); // 데이터를 순서대로 저장하기 위해 LinkedHashMap 사용

            // 주문 정보를 추가
            rowData.put("후원번호", order.getOrderId());
            rowData.put("이름", order.getSupportingProject().getUser().getName());
            rowData.put("후원일시", order.getCreatedAt());

            // 패키지 정보를 추가
            rowData.put("패키지 이름", joinSupportingPackageDetails(order.getSupportingPackage(),
                    supportingPackage -> String.valueOf(supportingPackage.getProjectPackage().getPackageName())));
            rowData.put("패키지 개수", joinSupportingPackageDetails(order.getSupportingPackage(),
                    supportingPackage -> String.valueOf(supportingPackage.getPackageCount())));
            rowData.put("패키지 가격", joinSupportingPackageDetails(order.getSupportingPackage(),
                    supportingPackage -> String.valueOf(supportingPackage.getProjectPackage().getPackagePrice())));

            // 옵션 정보를 추가
            rowData.put("패키지 옵션 정보", joinSupportingPackageDetails(order.getSupportingPackage(),
                    supportingPackage -> String.valueOf(supportingPackage.getOptionList())));

            // 결제 정보가 있을 경우 추가
            if (order.getPayment() != null) {
                rowData.put("결제 여부", order.getPayment().getPaymentStatus());
            }

            // 배송 정보가 있을 경우 추가
            if (order.getDelivery() != null) {
                rowData.put("배송지명", order.getDelivery().getDeliveryName());
                rowData.put("전화번호", order.getDelivery().getDeliveryPhoneNumber());
                rowData.put("이메일", order.getDelivery().getDeliveryEmail());
                rowData.put("주소", order.getDelivery().getDeliveryAddress());
                rowData.put("상세주소", order.getDelivery().getDeliveryDetailedAddress());
                rowData.put("배송 메시지", order.getDelivery().getDeliveryMessage());
                rowData.put("우편번호", order.getDelivery().getDeliveryPostCode());
            }

            // 수집한 데이터를 리스트에 추가
            data.add(rowData);
        }

        // 엑셀 생성을 위한 데이터 리스트 반환
        return data;
    }

    // 내가 진행중인 프로젝트의 후원자(배송, 후원, 주문 등) 정보 엑셀 파일 생성 및 조회
    @Override
    public String generateUploadAndGetPresignedUrlForSupportersExcel(Long projectId) throws IOException {
        // 후원자 데이터를 가져옴
        List<Map<String, Object>> supportersData = getSupportersData(projectId);

        // 후원자 데이터가 비어있는지 확인
        if (supportersData.isEmpty()) {
            throw new IllegalStateException("후원자 데이터가 없거나 비어 있습니다.");
        }

        // 엑셀 파일의 이름과 형식을 설정
        String fileName = "Supporter_Management_" + projectId;
        String fileType = ".xlsx";

        // 엑셀 파일을 생성하고, 생성이 실패한 경우 예외 처리
        File excelFile = excelGenerator.generateExcelFile(fileName, supportersData);
        if (excelFile == null) {
            throw new IllegalStateException("엑셀 파일 생성에 실패했습니다.");
        }

        // 생성된 파일이 존재하는지, 크기가 0이 아닌지 확인
        if (!excelFile.exists() || excelFile.length() == 0) {
            throw new IllegalStateException("생성된 엑셀 파일이 존재하지 않거나 비어 있습니다.");
        }

        // S3Util 인스턴스가 초기화되었는지 확인
        if (s3Util == null) {
            throw new IllegalStateException("S3Util이 초기화되지 않았습니다.");
        }

        // 생성된 엑셀 파일을 S3 버킷에 업로드
        s3Util.uploadFileToS3(fileName, fileType, excelFile);

        // 업로드된 파일에 대한 presigned URL을 생성하여 반환 (유효 시간 설정)
        return s3Util.generatePresignedUrlWithExpiration(fileName, fileType, s3UrlExpirationMinutes);
    }

    // Set으로 이루어진 여러개의 패키지 정보 "," 기준으로 병합
    private String joinSupportingPackageDetails(Set<SupportingPackage> supportingPackages, Function<SupportingPackage, String> mapper) {
        // 패키지 정보를 단일 문자열로 변환, 각 항목은 쉼표로 구분됨
        return supportingPackages.stream()
                .map(mapper)
                .collect(Collectors.joining(", "));
    }


    private Set<PaymentPackageDTO> packageEntityToDto(Set<SupportingPackage> supportingPackage){
        return supportingPackage.stream().map(pac-> PaymentPackageDTO.builder()
                .id(pac.getProjectPackage().getId())
                .name(pac.getProjectPackage().getPackageName())
                .price(pac.getProjectPackage().getPackagePrice())
                .count(pac.getPackageCount())
                .rewardList(convertToPaymentRewardDTOList(pac.getProjectPackage().getPackageRewards(), pac.getOptionList()))
                .build()).collect(Collectors.toSet());
    }

    private List<PaymentRewardDTO> convertToPaymentRewardDTOList(List<PackageRewards> packageRewards, String optionList) {
        return packageRewards.stream()
                .map(pr->PaymentRewardDTO.builder()
                        .rewardName(pr.getProjectReward().getRewardName())
                        .selectOption(optionList)
                        .build()
                ).collect(Collectors.toList());
    }

    // 해당 프로젝트 아이디의 프로젝트가 존재하는지 유효성 확인
    private void validateProjectExistenceForProjectId(Long projectId) {
        projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
    }

}
