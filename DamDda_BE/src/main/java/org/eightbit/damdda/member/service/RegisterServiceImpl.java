package org.eightbit.damdda.member.service;

import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.member.dto.RegisterDTO;
import org.eightbit.damdda.member.repository.MemberRepository;
import org.eightbit.damdda.member.repository.RegisterRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RegisterServiceImpl implements RegisterService {

    private final RegisterRepository registerRepository;
    private final MemberRepository memberRepository;

    @Override
    public void insertMember(RegisterDTO request) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        request.setPassword(encoder.encode(request.getPassword()));
        registerRepository.save(request.toEntity());
    }

    @Override
    public boolean checkLoginId(String loginId) {
        return memberRepository.findByLoginId(loginId).isPresent();
    }

    @Override
    public boolean checkNickname(String nickname) {
        return registerRepository.findByNickname(nickname).isPresent();
    }

}