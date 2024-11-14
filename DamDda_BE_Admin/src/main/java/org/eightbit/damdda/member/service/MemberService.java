package org.eightbit.damdda.member.service;

import org.eightbit.damdda.admin.dto.PageRequestDTO;
import org.eightbit.damdda.admin.dto.PageResponseDTO;
import org.eightbit.damdda.member.dto.MemberDTO;

public interface MemberService {
    PageResponseDTO<MemberDTO> findByKeyword(PageRequestDTO pageRequestDTO);
}
