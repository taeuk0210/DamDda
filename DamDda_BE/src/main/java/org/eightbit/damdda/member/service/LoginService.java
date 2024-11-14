package org.eightbit.damdda.member.service;

import org.eightbit.damdda.member.dto.MemberSearchDTO;

public interface LoginService {
    String findId(String name, String email);

    Boolean modifyPassword(Long id, String password);

    Long checkMemberDetails(MemberSearchDTO memberSearchDTO);

}