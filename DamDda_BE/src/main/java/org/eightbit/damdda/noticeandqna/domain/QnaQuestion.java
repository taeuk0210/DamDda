package org.eightbit.damdda.noticeandqna.domain;

import lombok.*;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.project.domain.Project;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * Q&A 질문 엔티티 클래스.
 * Q&A 질문에 대한 정보를 데이터베이스와 매핑하여 저장.
 * DateEntity를 상속받아 id, savedAt, deletedAt 필드를 재사용.
 */
@Entity
@Table(name = "qna_questions")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EntityListeners(value = {AuditingEntityListener.class})
public class QnaQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Q&A가 작성된 프로젝트.
     * - 여러 Q&A 질문은 하나의 프로젝트에 속함 (Many-to-One 관계).
     * - 프로젝트 삭제 시 관련 Q&A도 삭제 (CascadeType.ALL).
     * - 지연 로딩(LAZY)으로 프로젝트 데이터를 필요할 때만 가져옴.
     * - nullable = false: 프로젝트는 반드시 존재해야 함.
     */
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    private Project project;

    /**
     * Q&A 질문 작성자 (회원).
     * - 여러 Q&A 질문은 하나의 회원이 작성할 수 있음 (Many-to-One 관계).
     * - 회원 삭제 시 관련 Q&A도 삭제 (CascadeType.ALL).
     * - 지연 로딩(LAZY)으로 회원 데이터를 필요할 때만 가져옴.
     * - nullable = false: 작성자는 반드시 존재해야 함.
     */
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    private Member member;

    /**
     * Q&A 질문의 제목.
     * - 제목의 길이는 최대 100자까지 허용되며, 반드시 입력되어야 함.
     */
    @Column(length = 100, nullable = false)
    private String title;

    /**
     * Q&A 질문의 내용.
     * - 내용의 길이는 최대 500자까지 허용되며, 반드시 입력되어야 함.
     */
    @Column(length = 500, nullable = false)
    private String content;
    /**
     * Q&A 질문의 공개 설정 (PUBLIC/PRIVATE).
     * - ENUM 타입을 데이터베이스에 문자열로 저장.
     * - 필수 항목으로 null일 수 없음.
     */
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PUBLIC', 'PRIVATE')", nullable = false)
    private Visibility visibility;
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;

    /**
     * 공개 설정 옵션 (Enum 타입).
     * - Q&A 질문이 공개(PUBLIC) 또는 비공개(PRIVATE) 여부를 결정.
     */
    public enum Visibility {
        PUBLIC,  // 공개.
        PRIVATE // 비공개.
    }
}