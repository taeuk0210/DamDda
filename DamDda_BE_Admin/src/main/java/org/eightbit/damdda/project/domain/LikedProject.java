package org.eightbit.damdda.project.domain;

import lombok.*;
import org.eightbit.damdda.member.domain.Member;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "liked_projects")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class LikedProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Member member;

    @ManyToOne
    private Project project;

    @CreatedDate
    @Column
    private LocalDateTime likedAt;
}
