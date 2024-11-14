package org.eightbit.damdda.member.service;

import org.eightbit.damdda.member.dto.RegisterDTO;

public interface RegisterService {
    void insertMember(RegisterDTO registerDTO);

    boolean checkLoginId(String loginId);

    boolean checkNickname(String nickname);
}