package org.eightbit.damdda.member.dto;

import lombok.*;
import org.eightbit.damdda.member.domain.Member;

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
    private LocalDateTime deletedAt;

    public static MemberDTO of(Member member) {
        return MemberDTO.builder()
                .id(member.getId())
                .loginId(member.getLoginId())
                .nickname(member.getNickname())
                .name(member.getName())
                .email(member.getEmail())
                .phoneNumber(member.getPhoneNumber())
                .address(member.getAddress())
                .detailedAddress(member.getDetailedAddress())
                .postCode(member.getPostCode())
                .imageUrl(member.getImageUrl())
                .build();
    }

    public Member toEntity() {
        return Member.builder()
                .id(id)
                .loginId(loginId)
                .password(password)
                .nickname(nickname)
                .name(name)
                .email(email)
                .phoneNumber(phoneNumber)
                .address(address)
                .detailedAddress(detailedAddress)
                .postCode(postCode)
                .imageUrl(imageUrl)
                .deletedAt(deletedAt)
                .build();
    }

}