package org.eightbit.damdda.project.domain;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "tags")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "projects") // projects 필드를 제외하여 순환 참조 방지
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Setter
    private Integer usageFrequency;

    @ManyToMany(mappedBy = "tags")
    @Setter
    private List<Project> projects;
}
