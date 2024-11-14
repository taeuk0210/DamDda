package org.eightbit.damdda.member.domain;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@EntityListeners(value = {AuditingEntityListener.class})
public class Member {
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String loginId;

    private String password;

    @Column(unique = true)
    private String nickname;

    private String name;

    private String email;

    private String phoneNumber;

    private String imageUrl;

    private String address;

    private String detailedAddress;

    private Integer postCode;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime deletedAt;

}