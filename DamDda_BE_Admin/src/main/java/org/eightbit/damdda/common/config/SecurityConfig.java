package org.eightbit.damdda.common.config;

import lombok.RequiredArgsConstructor;
import org.eightbit.damdda.common.except.AuthEntryPoint;
import org.eightbit.damdda.common.filter.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
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

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Value("${org.eightbit.client.url}")
    private String clientUrl;

    private final UserDetailsService userDetailsService;
    private final AuthenticationFilter authenticationFilter;
    private final AuthEntryPoint authEntryPoint;

    /*
     * Spring Security 내부에서 인증과정시 사용되는 AuthenticationManager 객체를
     * LoginController 에서도 접근할 수 있도록 Spring container bean으로 등록
     * */
    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    /*
     * 인증한 UserDetailsService 객체에 암호화 객체 설정을 추가
     * DB에 암호를 저장하기 전해 BCrypt 암호화 처리 수행
     * 인증 과정에서도 입력된 암호를 암호화 하고 DBMS의 암호와 비교
     * */
    @Autowired // 메소드 파라미터 AuthenticationManagerBuilder를 주입
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(new BCryptPasswordEncoder());
    }

    /*
     * Spring security의 보안 설정, 주소 권한 허용 등의 설정 메소드
     * */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // CSRF 공격은 세션을 사용하는데, 우리는 REST API 서버이기 때문에 disable 해도 됨
        http.csrf().disable()
                // CORS는 사용함(REST 서버라 다른 서버로부터 요청을 막지 않아야 됨)
                .cors().and()
                // REST API Server는 session 상태를 유지하지 않음
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                // ??
                .authorizeRequests()
                // "/login" 에 대한 POST 요청은 누구나 접근을 허용함!
                .antMatchers(HttpMethod.POST, "/admin/login").permitAll()
                .antMatchers(HttpMethod.POST, "/admin/reissue").permitAll()
                .antMatchers(HttpMethod.GET, "/admin/logout").permitAll()
                .antMatchers(HttpMethod.GET, "/admin/files/**").permitAll()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//                .anyRequest().permitAll();// 임시로 모든 요청 허용 (개발때만)

                // 다른 엔드포인트 요청은 인증과정을 거쳐야 접근할 수 있음
                .anyRequest().authenticated().and()
                // "/login" 을 제외한 나머지 모든 요청은 인증전, 필터를 거쳐 토큰을 확인하게 됨
                .addFilterBefore(authenticationFilter,
                        UsernamePasswordAuthenticationFilter.class)
                // 인증에 오류가 있을 때, 오류 응답 처리를 authEntryPoint가 담당
                .exceptionHandling().authenticationEntryPoint(authEntryPoint);

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of(
                clientUrl,
                "http://www.damdda.store",
                "http://223.130.156.95",
                "http://localhost",
                "http://193.186.4.174",
                "http://localhost:3000",
                "http://54.180.102.205:80"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));  // 허용할 요청 헤더
        config.setExposedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}