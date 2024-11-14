package org.eightbit.damdda.admin.domain;

import lombok.*;

import javax.persistence.*;

/**
 * 관리자(Admin) 엔티티. 'admins' 테이블과 매핑됨.
 */
@Entity
@Table(name = "admins")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Admin {

    /**
     * 관리자 고유 식별자 (ID)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 관리자 로그인 ID
     */
    private String loginId;

    /**
     * 관리자 비밀번호
     */
    private String password;
}