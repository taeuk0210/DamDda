package org.eightbit.damdda.member.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.eightbit.damdda.member.domain.Member;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
public class RegisterDTO {

    @NotNull(message = "ID를 입력해야만 회원가입이 가능합니다.")
    private String loginId;

    @NotNull(message = "Password를 입력해야만 회원가입이 가능합니다.")
    @Size(min = 8, max = 16, message = "비밀번호는 8자 이상 16자 이하로 작성해야 합니다.")
    private String password;

    @NotNull(message = "NickName을 입력해야만 회원가입이 가능합니다.")
    private String nickname;

    @NotNull(message = "Name을 입력해야만 회원가입이 가능합니다.")
    private String name;

    @NotNull(message = "Email을 입력해야만 회원가입이 가능합니다.")
    private String email;

    @NotNull(message = "PhoneNumber를 입력해야만 회원가입이 가능합니다.")
    private String phoneNumber;

    private String address;

    private String detailedAddress;
    // int -> Integer로 변경
    private Integer postCode;

    public Member toEntity() {
        return Member.builder()
                .loginId(loginId)
                .password(password)
                .nickname(nickname)
                .name(name)
                .email(email)
                .phoneNumber(phoneNumber)
                .address(address)
                .detailedAddress(detailedAddress)
                .postCode(postCode)
                .build();
    }
}