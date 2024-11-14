package org.eightbit.damdda.noticeandqna.domain;

import lombok.*;
import org.eightbit.damdda.member.domain.Member;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "qna_replies")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EntityListeners(value={AuditingEntityListener.class})
public class QnaReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    private QnaQuestion qnaQuestion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private QnaReply parentReply;

    @Column(length = 300, nullable = false)
    private String content;

    @Column(nullable = false)
    private int depth;

    @Column(nullable = false)
    private int orderPosition;

    @CreatedDate
    @Column(updatable = false)
    private Timestamp createdAt;

    private Timestamp deletedAt;
}