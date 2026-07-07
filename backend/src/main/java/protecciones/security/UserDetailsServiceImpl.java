package protecciones.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import protecciones.entity.Usuario;
import protecciones.repository.UsuarioRepository;

import java.util.List;

@Service
public class UserDetailsServiceImpl
        implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UserDetailsServiceImpl(
            UsuarioRepository usuarioRepository
    ) {

        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(
            String identificador
    ) {

        Usuario usuario =
                usuarioRepository
                        .findByEmail(identificador)
                        .or(() ->
                                usuarioRepository
                                        .findByNumeroSobre(identificador)
                        )
                        .filter(u ->
                                Boolean.TRUE.equals(
                                        u.getActivo()
                                )
                                        && u.getPasswordHash() != null
                        )
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "Credenciales invalidas"
                                )
                        );

        return org.springframework.security.core.userdetails.User
                .withUsername(usuario.getEmail())
                .password(usuario.getPasswordHash())
                .authorities(
                        List.of(
                                new SimpleGrantedAuthority(
                                        usuario.getRol()
                                )
                        )
                )
                .build();
    }
}
