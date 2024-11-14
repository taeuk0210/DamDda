package org.eightbit.damdda.order.dto;

import lombok.*;
import org.eightbit.damdda.order.domain.Delivery;
import org.eightbit.damdda.order.domain.Payment;
import org.eightbit.damdda.order.domain.SupportingProject;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@ToString
public class OrderDTO {
    private Long orderId;
    private Delivery delivery;  // 연관된 Delivery 객체
    private Payment payment;  // 연관된 Payment 객체

    /* 중요 */
    /*supportingProject -> DTO로 바꾸기*/
    private SupportingProject supportingProject;  // 연관된 SupportingProject 객체
    private Set<PaymentPackageDTO> paymentPackageDTO;  // 연관된 SupportingPackage 객체

}