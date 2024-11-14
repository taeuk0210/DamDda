package org.eightbit.damdda.member.service;

import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.member.dto.MemberDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

public interface MemberService {
    String uploadFile(MultipartFile file) throws IOException;

    Map<String, Object> getUserInfo(Long member_id);

    void deleteFIle(String fileName);

    Optional<Member> findById(Long memberId);

    Member getById(Long memberId);

    MemberDTO getMember(String loginId);

    MemberDTO updateMember(MemberDTO memberDTO);

    MemberDTO confirmPw(String loginId, String password);

    // 탈퇴 기능 추가
    void deleteMember(Long memberId);
}