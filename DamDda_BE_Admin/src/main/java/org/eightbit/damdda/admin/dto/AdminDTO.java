package org.eightbit.damdda.admin.dto;

import lombok.Getter;
import org.eightbit.damdda.admin.domain.Admin;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Getter
public class AdminDTO extends User {

    private Long id;
    private String loginId;
    // Authertication 을 위해서 spring security의 User 클래스를 상속받아 인증에 사용
    public AdminDTO(Admin admin, Collection<? extends GrantedAuthority> authorities) {
        super(admin.getLoginId(), admin.getPassword(), authorities);
        this.id = admin.getId();
        this.loginId = admin.getLoginId();

    }
}