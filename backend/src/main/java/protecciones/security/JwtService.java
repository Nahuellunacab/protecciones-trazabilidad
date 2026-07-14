package protecciones.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;

    private final long expirationMs;

    public JwtService(
            @Value("${jwt.secret}")
            String secret,
            @Value("${jwt.expiration-ms:28800000}")
            long expirationMs
    ) {

        this.secretKey =
                Keys.hmacShaKeyFor(
                        secret.getBytes()
                );

        this.expirationMs = expirationMs;
    }

    public String generarToken(
            UserDetails userDetails
    ) {

        Date ahora = new Date();

        Date expiracion =
                new Date(
                        ahora.getTime() + expirationMs
                );

        return Jwts.builder()
                .subject(
                        userDetails.getUsername()
                )
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(secretKey)
                .compact();
    }

    public String extraerEmail(
            String token
    ) {

        return extraerClaims(token)
                .getSubject();
    }

    public boolean esTokenValido(
            String token,
            UserDetails userDetails
    ) {

        String email =
                extraerEmail(token);

        return email.equals(
                userDetails.getUsername()
        )
                && !estaExpirado(token);
    }

    private boolean estaExpirado(
            String token
    ) {

        return extraerClaims(token)
                .getExpiration()
                .before(new Date());
    }

    private Claims extraerClaims(
            String token
    ) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
