package org.eightbit.damdda.collaboration.domain;

import lombok.*;
import org.eightbit.damdda.common.domain.BaseEntity;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.project.domain.Project;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.sql.Timestamp;

@Entity
@Table(name = "collaboration")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Collaboration extends BaseEntity {
    @ManyToOne
    private Member member;
    @ManyToOne
    private Project project;

    @CreatedDate
    private Timestamp requestDate;

    private Timestamp approvalDate;

    private String approval;

    private String collaborationText;

    private String name;

    private String email;

    private String phoneNumber;
}

