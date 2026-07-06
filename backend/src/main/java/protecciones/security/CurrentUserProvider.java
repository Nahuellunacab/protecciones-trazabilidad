package protecciones.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import protecciones.entity.Usuario;
import protecciones.exception.BusinessException;
import protecciones.repository.UsuarioRepository;

@Component
public class CurrentUserProvider {

    private final UsuarioRepository usuarioRepository;

    public CurrentUserProvider(
            UsuarioRepository usuarioRepository
    ) {

        this.usuarioRepository = usuarioRepository;
    }

    public Usuario obtenerUsuarioActual() {

        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new BusinessException(
                    "No hay un usuario autenticado"
            );
        }

        String email =
                authentication.getName();

        return usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(
                                "El usuario autenticado ya no existe"
                        )
                );
    }
}
