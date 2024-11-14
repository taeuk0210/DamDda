package org.eightbit.damdda.noticeandqna.domain;

import lombok.*;
import org.eightbit.damdda.project.domain.Project;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 공지사항(Notice) 엔티티 클래스.
 * 공지사항 데이터를 데이터베이스와 매핑하여 저장.
 * DateEntity를 상속받아 id, savedAt, deletedAt 필드를 포함.
 */
@Entity
@Table(name = "notices")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EntityListeners(value = {AuditingEntityListener.class})
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 공지사항이 속한 프로젝트와의 관계.
     * - 다대일(Many-to-One) 관계로, 여러 공지사항이 하나의 프로젝트에 속함.
     * - FetchType.LAZY로 설정하여 프로젝트 정보는 필요할 때만 가져옴.
     * - 프로젝트는 필수로 존재해야 하므로 optional = false로 설정.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    private Project project;

    /**
     * 공지사항의 제목.
     * - 제목은 최대 100자까지 허용되며, 반드시 입력해야 함 (nullable = false).
     */
    @Column(length = 100, nullable = false)
    private String title;

    /**
     * 공지사항의 내용.
     * - 내용은 최대 500자까지 허용되며, 반드시 입력해야 함 (nullable = false).
     */
    @Column(length = 500, nullable = false)
    private String content;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime deletedAt;
}