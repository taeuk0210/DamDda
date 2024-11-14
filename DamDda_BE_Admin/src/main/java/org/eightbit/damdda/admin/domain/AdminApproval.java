package org.eightbit.damdda.admin.domain;

import lombok.*;
import org.eightbit.damdda.admin.dto.ApprovalUpdateDTO;
import org.eightbit.damdda.project.domain.Project;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 관리자 승인(AdminApproval) 엔티티. 'admin_approvals' 테이블과 매핑됨.
 */
@Entity
@Table(name = "admin_approvals")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AdminApproval {

    /**
     * 관리자 승인 고유 식별자 (ID)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 프로젝트와의 1:1 매핑
     */
    @OneToOne
    private Project project;

    /**
     * 승인 상태 (0: 대기, 1: 승인, 2: 거절)
     */
    @ColumnDefault("0")
    private Integer approval;

    /**
     * 승인 관련 설명 (기본값: '프로젝트 승인 대기 중...')
     */
    @ColumnDefault("'프로젝트 승인 대기 중...'")
    private String approvalText;

    /**
     * 승인 처리 시간
     */
    private LocalDateTime approvalAt;

    public void changeApproval(ApprovalUpdateDTO approvalUpdateDTO) {
        this.approval = approvalUpdateDTO.getApproval();
        if (this.approval == 2) {
            this.approvalText = approvalUpdateDTO.getApprovalText();
        } else {
            this.approvalAt = LocalDateTime.now();
        }
    }
}

