package org.eightbit.damdda.security.user;

import lombok.Getter;
import org.eightbit.damdda.member.domain.Member;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class User implements UserDetails {

    private final Member member;

    public User(Member member) {
        this.member = member;
    }

    // Lombok @Getter로 대체되지 않는 추가 메서드들
    public String getNickname() {
        return member.getNickname();
    }

    public String getLoginId() {
        return member.getLoginId();
    }

    public Long getMemberId() {
        return member.getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return member.getPassword();
    }

    @Override
    public String getUsername() {
        return member.getLoginId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
