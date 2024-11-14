package org.eightbit.damdda.order.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "kakaopay_interface")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class KakaoPayInterface {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long kakaopayInterfaceId;

    @ManyToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;
}

