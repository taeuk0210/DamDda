package org.eightbit.damdda.project.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "project_image_type")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProjectImageType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageType;
}

