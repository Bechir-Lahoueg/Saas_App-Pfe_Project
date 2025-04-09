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

    public String createToken(Map<String, Object> extraClaims, String subject, long expiration) {
        return Jwts
                .builder()
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .setHeaderParam("typ", "JWT")
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))

                .compact();
    }

    public String generateToken(Tenant tenant) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", tenant.getId().toString());
        claims.put("subdomain", tenant.getSubdomain()); // Add subdomain for tenant identification
        return createToken(claims, tenant.getEmail(), EXPIRATION);
    }

    public String generateRefreshToken(Tenant tenant) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", tenant.getId());

        return createToken(claims, tenant.getEmail(), REFRESH_TOKEN_EXPIRATION);
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String jwtToken) {
        return extractClaim(jwtToken, Claims::getSubject);
    }

    public <T> T extractClaim(String jwtToken, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(jwtToken);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String jwtToken) {
        return Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(jwtToken).getBody();
    }

    public Boolean isTokenValid(String jwtToken, UserDetails userDetails) {
        final String username = extractUsername(jwtToken);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(jwtToken));
    }

    private boolean isTokenExpired(String jwtToken) {
        return extractExpiration(jwtToken).before(new Date());
    }

    private Date extractExpiration(String jwtToken) {
        return extractClaim(jwtToken, Claims::getExpiration);
    }


}