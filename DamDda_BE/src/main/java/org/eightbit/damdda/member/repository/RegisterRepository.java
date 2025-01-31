package org.eightbit.damdda.member.repository;

import org.eightbit.damdda.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegisterRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByNickname(String nickname);
}