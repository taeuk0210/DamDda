package org.eightbit.damdda.member.repository.search;

import org.eightbit.damdda.member.domain.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MemberSearch {
    Page<Member> findByKeyword(String query, String keyword, Pageable pageable);

}
