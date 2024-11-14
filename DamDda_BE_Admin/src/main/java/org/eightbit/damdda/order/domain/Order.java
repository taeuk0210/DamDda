package org.eightbit.damdda.order.domain;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "orders")
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@EntityListeners(value = {AuditingEntityListener.class})
@EqualsAndHashCode(exclude = "supportingPackage")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;  // 기본키로 주문 ID를 설정

    // Delivery 정보와 연관된 필드
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "delivery_id", nullable = false)
    private Delivery delivery;

    // Payment 정보와 연관된 필드
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    // SupportingProject 정보와 연관된 필드
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "supporting_project_id", nullable = false)
    private SupportingProject supportingProject;

    // 양방향 관계 설정, mappedBy 사용
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SupportingPackage> supportingPackage;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
