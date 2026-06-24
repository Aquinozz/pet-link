package pet_link.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Slf4j
@Component
public class TokenProvider {

    @Value("${jwt.expiration}")
    private Long expirationTime;

    @Value("${jwt.secret}")
    private String key;

    //gerar token
    public String gerarToken(Authentication authentication){
        UserDetails user = (UserDetails) authentication.getPrincipal();

        log.info("Gerando token para usuário: {}", user.getUsername());

        return buildToken(user.getUsername(), user.getAuthorities());
    }

    private String buildToken(String username, Collection<? extends GrantedAuthority> authorities){
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationTime);

        List<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        String token = Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSigningKey())
                .compact();

        log.debug("Token gerado com sucesso para usuário: {}", username);

        return token;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(key.getBytes());
    }

    //validar token
    public Boolean isTokenValid(String token){
        try{
            getClaims(token);

            log.debug("Token válido");

            return true;
        } catch (Exception e){

            log.warn("Token inválido: {}", e.getMessage());

            return false;
        }
    }

    private Claims getClaims(String token){
        //validar assinatura
        //validar expiracao

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    //extrair infos do token
    public String getUsername(String token){
        String username = getClaims(token).getSubject();

        log.debug("Username extraído do token: {}", username);

        return username;
    }
}