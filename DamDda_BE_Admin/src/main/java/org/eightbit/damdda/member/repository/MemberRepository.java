package org.eightbit.damdda.member.repository;


import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.member.repository.search.MemberSearch;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MemberRepository extends JpaRepository<Member, Long>, MemberSearch {

}
