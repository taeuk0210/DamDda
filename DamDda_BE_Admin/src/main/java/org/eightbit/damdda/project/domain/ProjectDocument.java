package org.eightbit.damdda.project.domain;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "project_documents")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProjectDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Project project;

    private int ord;
    private String fileName;
    private String url;
}

