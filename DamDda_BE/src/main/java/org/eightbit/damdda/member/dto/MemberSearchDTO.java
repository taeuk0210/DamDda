package org.eightbit.damdda.member.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MemberSearchDTO {

    private String loginId;
    private String name;
    private String email;

}