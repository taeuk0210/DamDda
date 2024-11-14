package org.eightbit.damdda.order.domain;

import lombok.*;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.project.domain.Project;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "supporting_projects")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SupportingProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supportingProjectId;

    private LocalDateTime supportedAt; // 후원 시간

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")  // Member의 기본 키인 id를 참조
    private Member user;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
}
