package com.example.auth_service.service;

import com.example.auth_service.entities.Tenant;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${spring.security.jwt.secret-key}")
    private String SECRET_KEY;

    @Value("${spring.security.jwt.expiration}")
    private Long EXPIRATION;

    @Value("${spring.security.jwt.refresh-token.expiration}")
    private Long REFRESH_TOKEN_EXPIRATION;

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private String createToken(Map<String, Object> claims,
                               String subject,
                               long expirationTime) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)            // ← JWT “sub” is the username
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Issue a new access token.  If the UserDetails is actually your Tenant entity,
     * we pull out its ID & subdomain into the token claims.
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        if (userDetails instanceof Tenant) {
            Tenant t = (Tenant) userDetails;
            claims.put("id",        t.getId());
            claims.put("subdomain", t.getSubdomain());
        }

        // username() is the email, so we set that as the JWT subject
        return createToken(claims, userDetails.getUsername(), EXPIRATION);
    }

    /**
     * You can keep a separate refresh‐token generator if you like;
     * here we also include id and subdomain for completeness.
     */
    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        if (userDetails instanceof Tenant) {
            Tenant t = (Tenant) userDetails;
            claims.put("id",        t.getId());
            claims.put("subdomain", t.getSubdomain());
        }

        return createToken(claims, userDetails.getUsername(), REFRESH_TOKEN_EXPIRATION);
    }

    public String extractUsername(String jwtToken) {
        return extractClaim(jwtToken, Claims::getSubject);
    }

    private Date extractExpiration(String jwtToken) {
        return extractClaim(jwtToken, Claims::getExpiration);
    }

    public <T> T extractClaim(String jwtToken, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(jwtToken)
                .getBody();
        return claimsResolver.apply(claims);
    }

    private boolean isTokenExpired(String jwtToken) {
        return extractExpiration(jwtToken).before(new Date());
    }

    public boolean isTokenValid(String jwtToken, UserDetails userDetails) {
        final String username = extractUsername(jwtToken);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(jwtToken);
    }
}
