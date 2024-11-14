package org.eightbit.damdda.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.eightbit.damdda.security.jwt.JwtService;
import org.eightbit.damdda.security.user.AccountCredentials;
import org.eightbit.damdda.security.user.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final JwtService jwtService;

    public LoginFilter(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.jwtService = jwtService;
        setAuthenticationManager(authenticationManager); // AuthenticationManager 설정
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            AccountCredentials loginRequest = objectMapper.readValue(request.getInputStream(), AccountCredentials.class);

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(loginRequest.getLoginId(), loginRequest.getPassword());

            return getAuthenticationManager().authenticate(authenticationToken);
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse login request", e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) {
        User user = (User) authResult.getPrincipal(); // UserDetails로 캐스팅
        String token = jwtService.getToken(user.getMember().getId(), user.getUsername());

        response.setHeader("Authorization", "Bearer " + token);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Authentication failed: " + failed.getMessage());
    }
}
