package org.eightbit.damdda.member.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.member.dto.MemberDTO;
import org.eightbit.damdda.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Transactional
@Log4j2
@RequiredArgsConstructor
@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final AmazonS3 amazonS3;
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Override
    public Map<String, Object> getUserInfo(Long member_id) {
        Member member = memberRepository.findById(member_id).orElseThrow();
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", member.getLoginId());
        userInfo.put("key", member.getId());
        userInfo.put("imageUrl", member.getImageUrl());
        userInfo.put("nickname", member.getNickname());
        userInfo.put("name", member.getName());

        return userInfo;
    }

    @Override
    @Transactional
    public String uploadFile(MultipartFile file) throws IOException {

        String fileName = "profile/" + file.getOriginalFilename();
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName, file.getInputStream(), null).withCannedAcl(CannedAccessControlList.PublicRead);
        amazonS3.putObject(putObjectRequest);
        return amazonS3.getUrl(bucketName, fileName).toString();

    }

    @Override
    @Transactional
    public void deleteFIle(String fileName) {
        DeleteObjectRequest deleteObjectRequest = new DeleteObjectRequest(bucketName, fileName);
        amazonS3.deleteObject(deleteObjectRequest);
    }

    @Override
    public Optional<Member> findById(Long memberId) {
        return memberRepository.findById(memberId);
    }

    @Override
    public Member getById(Long memberId) {
        return memberRepository.getById(memberId);
    }

    @Override
    public MemberDTO getMember(String loginId) {
        Optional<Member> member = memberRepository.findByLoginId(loginId);
        return member.map(MemberDTO::of).orElse(null);
    }

    @Override
    public MemberDTO confirmPw(String loginId, String password) {
        Optional<Member> optionalMember = memberRepository.findByLoginId(loginId);
        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();
            String encodedPassword = member.getPassword();
            if (passwordEncoder.matches(password, encodedPassword)) {
                MemberDTO memberDTO = MemberDTO.of(member);
                memberDTO.setPassword(null);
                return memberDTO;
            }
        }
        return null;
    }

    // 탈퇴 기능 추가
    @Override
    public void deleteMember(Long id) {
        MemberDTO memberDTO = new MemberDTO();

        memberDTO.setId(id);
        memberDTO.setLoginId(null);
        memberDTO.setPassword(null);
        memberDTO.setName(null);
        memberDTO.setNickname(null);
        memberDTO.setEmail(null);
        memberDTO.setPhoneNumber(null);
        memberDTO.setAddress(null);
        memberDTO.setDetailedAddress(null);
        memberDTO.setPostCode(null);
        memberDTO.setImageUrl(null);
        memberDTO.setDeletedAt(LocalDateTime.now());

        Member member = memberDTO.toEntity();
        this.memberRepository.save(member);
    }

    @Transactional
    @Override
    public MemberDTO updateMember(MemberDTO memberDTO) {
        if (memberDTO.getPassword() == null || memberDTO.getPassword().isBlank()) {
            Member member = memberRepository.findById(memberDTO.getId()).orElseThrow();
            memberDTO.setPassword(member.getPassword());
        } else {
            memberDTO.setPassword(passwordEncoder.encode(memberDTO.getPassword()));
        }
        this.memberRepository.save(memberDTO.toEntity());
        memberDTO.setPassword(null);
        return memberDTO;
    }

}