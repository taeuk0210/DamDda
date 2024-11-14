package org.eightbit.damdda.member.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.member.dto.MemberSearchDTO;
import org.eightbit.damdda.member.repository.LoginRepository;
import org.eightbit.damdda.member.repository.MemberRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Log4j2
public class LoginServiceImpl implements LoginService {

    private final LoginRepository loginRepository;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public String findId(String name, String email) {
        Optional<Member> findMember = loginRepository.findByNameAndEmail(name, email);
        Member member = findMember.orElseThrow();
        return member.getLoginId();
    }

    @Transactional
    @Override
    public Boolean modifyPassword(Long id, String password) {
        Optional<Member> optionalMember = memberRepository.findById(id);
        Member member = optionalMember.orElseThrow();

        Member newMember = Member.builder()
                .id(member.getId())
                .loginId(member.getLoginId())
                .password(passwordEncoder.encode(password))
                .nickname(member.getNickname())
                .name(member.getName())
                .email(member.getEmail())
                .phoneNumber(member.getPhoneNumber())
                .imageUrl(member.getImageUrl())
                .address(member.getAddress())
                .detailedAddress(member.getDetailedAddress())
                .postCode(member.getPostCode())
                .createdAt(member.getCreatedAt())
                .build();

        this.memberRepository.save(newMember);
        return true;
    }

    @Override
    public Long checkMemberDetails(MemberSearchDTO memberSearchDTO) {
        Optional<Member> optionalMember = loginRepository.findByLoginIdAndNameAndEmail(memberSearchDTO.getLoginId(), memberSearchDTO.getName(), memberSearchDTO.getEmail());
        Member member = optionalMember.orElseThrow();

        return member.getId();
    }
}