package org.eightbit.damdda.project.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "project_images")
@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "project")
public class ProjectImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Project project;

    private String url;
    private int ord;
    private String fileName;

    @ManyToOne
    private ProjectImageType imageType;


}
