package org.eightbit.damdda.common.service;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Date;

@Log4j2
@Service
public class JwtService {
    /*
     * 토큰을 발급할 때 필요한 정보
     * EXPIRATION_TIME : 토큰의 유효시간, 1일로 설정
     * PREFIX : JWT 토큰 앞에 붙이는 접두사, JWT 앞에는 관습적으로 Bearer 를 붙임
     * KEY : 토큰의 발행 / 검증 시 사용하는 비밀키
     * */
    public static final int ACCESS_TOKEN_TYPE = 1;
    public static final int REFRESH_TOKEN_TYPE = 0;
    //                                                  ss : mm : hh
    public static final long ACCESS_EXPIRATION_TIME = 60 * 5 * 1 * 1000;
    public static final long REFRESH_EXPIRATION_TIME = 60 * 60 * 24 * 1000;
    static final String PREFIX = "Bearer ";
    static final Key KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // 토큰 발급 메소드
    public String getToken(String username, int tokenType) {
        long expirationTime = System.currentTimeMillis();
        if (tokenType == REFRESH_TOKEN_TYPE) {
            expirationTime += REFRESH_EXPIRATION_TIME;
        } else if (tokenType == ACCESS_TOKEN_TYPE) {
            expirationTime += ACCESS_EXPIRATION_TIME;
        }
        String token = Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(expirationTime))
                .signWith(KEY)
                .compact();
        return token;
    }

    // 클라이언트가 보내온 토큰에서 username을 추출하는 메소드
    public String getAuthUser(HttpServletRequest request) {
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);
        // 토큰이 헤더에 존재하면 유저를 추출
        if (token != null) {
            String user = Jwts.parserBuilder()
                    .setSigningKey(KEY)
                    .build()
                    .parseClaimsJws(token.replace(PREFIX, ""))
                    .getBody()
                    .getSubject();
            if (user != null) {
                return user;
            }
        }
        return null;
    }

}