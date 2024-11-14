package org.eightbit.damdda.order.domain;

import lombok.*;
import org.eightbit.damdda.project.domain.ProjectPackage;

import javax.persistence.*;

@Entity
@Table(name = "supporting_packages")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(exclude = "order")
public class SupportingPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_package_id")
    private ProjectPackage projectPackage;

    @ManyToOne
    @JoinColumn(name = "supporting_project_id")
    private SupportingProject supportingProject;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private Integer packageCount;

    @Column(columnDefinition = "json")
    private String OptionList;

}