package org.eightbit.damdda.security.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.member.domain.Member;
import org.eightbit.damdda.member.repository.LoginRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserDetailsServiceImpl implements UserDetailsService {

    private final LoginRepository loginRepository;

    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {

        return loadUserByLoginId(loginId);
    }

    private User loadUserByLoginId(String loginId) throws UsernameNotFoundException {
        Optional<Member> member = loginRepository.findByLoginId(loginId);

        User currentUser;

        if (member.isPresent()) {
            Member currentMember = member.get();
            currentUser = new User(currentMember);
        } else {
            throw new UsernameNotFoundException("User not found : " + loginId);
        }

        return currentUser;
    }

}
