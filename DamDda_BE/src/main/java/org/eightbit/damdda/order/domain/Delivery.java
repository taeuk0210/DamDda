package org.eightbit.damdda.order.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "deliveries")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deliveryId;

    private String deliveryName;
    private String deliveryPhoneNumber;
    private String deliveryEmail;
    private String deliveryAddress;
    private String deliveryDetailedAddress;
    private Integer deliveryPostCode;
    private String deliveryMessage;
}

