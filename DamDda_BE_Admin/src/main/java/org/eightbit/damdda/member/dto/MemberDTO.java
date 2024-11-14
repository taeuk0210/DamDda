package org.eightbit.damdda.member.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MemberDTO {
    private Long id;
    private String loginId;
    private String password;
    private String nickname;
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private String detailedAddress;
    private Integer postCode;
    private String imageUrl;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Timestamp createdAt;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Timestamp deletedAt;
}
