package org.eightbit.damdda.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.admin.domain.Admin;
import org.eightbit.damdda.admin.dto.AdminDTO;
import org.eightbit.damdda.admin.repository.AdminRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Log4j2
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AdminRepository adminRepository;

    // AdminController 에서 로그인 처리하기 위한 메소드를 오버라이딩
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Admin> admin = adminRepository.findByLoginId(username);

        if (admin.isPresent()) {
            Admin current = admin.get();
            List<GrantedAuthority> authorities = new ArrayList<>();
            return new AdminDTO(current, authorities);
        } else {
            throw new UsernameNotFoundException("USER Not Found : " + username);
        }

    }
}