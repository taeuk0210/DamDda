package org.eightbit.damdda.member.service;

import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.admin.dto.PageRequestDTO;
import org.eightbit.damdda.admin.dto.PageResponseDTO;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.member.dto.MemberDTO;
import org.eightbit.damdda.member.repository.MemberRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final ModelMapper modelMapper;

    @Override
    public PageResponseDTO<MemberDTO> findByKeyword(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage(), pageRequestDTO.getSize());
        Page<Member> result = memberRepository.findByKeyword(pageRequestDTO.getQuery(), pageRequestDTO.getKeyword(), pageable);
        List<MemberDTO> dtoList = result.getContent().stream()
                .map(member -> modelMapper.map(member, MemberDTO.class))
                .collect(Collectors.toList());
        return PageResponseDTO.<MemberDTO>builder()
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalPages(result.getTotalPages())
                .totalCounts(result.getNumberOfElements())
                .dtoList(dtoList)
                .build();
    }
}
