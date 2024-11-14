package org.eightbit.damdda.security.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.eightbit.damdda.security.filter.JwtAuthenticationFilter;
import org.eightbit.damdda.security.filter.LoginFilter;
import org.eightbit.damdda.security.jwt.AuthEntryPoint;
import org.eightbit.damdda.security.jwt.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Log4j2
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final AuthEntryPoint authEntryPoint;
    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;  // Allowed origins from external configuration

    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(new BCryptPasswordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        LoginFilter loginFilter = new LoginFilter(authenticationManagerBean(), jwtService); // 로그인 필터
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtService, userDetailsService); // JWT 인증 필터
        // TODO: Modification requried to narrow scope
        http.csrf().disable()
                .cors().and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests()
                .regexMatchers(HttpMethod.POST,
                        "^/member$",                                    // 회원 정보 등록 (회원가입)
                        "^/member/login$"                               // 로그인
                ).permitAll()
                .regexMatchers(HttpMethod.GET,
                        "^/notice\\?projectId=[^&]*$",
                        "^/member/.*$",                                 // 아이디 찾기
                        "^/member/check/.*$",                           // 회원 정보 확인
                        "^/member/check/id\\?loginId=[^&]*$",           // 로그인 ID 중복 확인
                        "^/member/check/nickname\\?nickname=[^&]*$",    // 닉네임 중복 확인
                        "^/project/.*",                                 // 프로젝트 목록 조회
                        "^/files/.*",                                   // 프로젝트 목록 조회
                        "^/project/\\d+$",                              // 프로젝트 상세 조회 (숫자만 매칭)
                        "^/package/\\d+$",                              // 프로젝트 선물 구성 조회 (숫자만 매칭)
                        "^/payment/kakao/.+$",
                        "^/payment/toss/.+$"
                ).permitAll()
                .regexMatchers(HttpMethod.PUT,
                        "^/member/\\d+/password$"                       // 비밀번호 변경
                ).permitAll()
                .anyRequest().authenticated().and()
                .logout()
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID").and()
                .addFilterBefore(loginFilter, UsernamePasswordAuthenticationFilter.class)  // 로그인 필터 추가
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)  // JWT 필터 추가
                .exceptionHandling().authenticationEntryPoint(authEntryPoint);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOrigins));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        log.debug("CORS allowed origins: {}", Arrays.toString(allowedOrigins));
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
