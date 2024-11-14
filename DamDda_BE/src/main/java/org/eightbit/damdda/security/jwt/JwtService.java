package org.eightbit.damdda.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.Date;

@Component
public class JwtService {

    static final long EXPIRATION_TIME = 60 * 60 * 24 * 1000; // 1 day in milliseconds
    static final String PREFIX = "Bearer ";
    static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Generate a secret key for HS256 algorithm

    public String getToken(Long memberId, String loginId) {
        return Jwts.builder()
                .setSubject(loginId)  // Set the loginId as the subject
                .claim("memberId", memberId)  // Add memberId to claims
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))  // Set token expiration
                .signWith(key)  // Sign with the secret key
                .compact();
    }

    public String getAuthUser(HttpServletRequest request) {
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (token != null && token.startsWith(PREFIX)) {
            // Use parserBuilder instead of deprecated parser()
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key) // Set the signing key
                    .build() // Build the parser
                    .parseClaimsJws(token.replace(PREFIX, "")) // Parse the token
                    .getBody();
            return claims.getSubject(); // Get the subject (loginId)
        }
        return null;
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = extractAllClaims(token);  // Extract all claims from the token
            return !isTokenExpired(claims);  // Check if the token is expired
        } catch (SecurityException e) {  // Catch security-related exceptions
            throw new RuntimeException("Invalid JWT signature", e);
        } catch (MalformedJwtException e) {  // Catch malformed token exceptions
            throw new RuntimeException("Invalid JWT token", e);
        } catch (ExpiredJwtException e) {  // Catch expired token exceptions
            throw new RuntimeException("JWT token is expired", e);
        } catch (UnsupportedJwtException e) {  // Catch unsupported token exceptions
            throw new RuntimeException("JWT token is unsupported", e);
        } catch (IllegalArgumentException e) {  // Catch invalid token format exceptions
            throw new RuntimeException("JWT claims string is empty", e);
        }
    }

    // Check if the token is expired
    private boolean isTokenExpired(Claims claims) {
        Date expiration = claims.getExpiration();
        return expiration.before(new Date()); // Compare the expiration date with the current date
    }

    // Extract all claims from the token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()  // Use parserBuilder instead of deprecated parser()
                .setSigningKey(key)  // Set the signing key
                .build()  // Build the parser
                .parseClaimsJws(token)  // Parse the token and extract claims
                .getBody();
    }
}
