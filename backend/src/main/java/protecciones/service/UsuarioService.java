package protecciones.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import protecciones.dto.UsuarioRequestDTO;
import protecciones.dto.UsuarioResponseDTO;

import protecciones.entity.Usuario;

import protecciones.exception.BusinessException;

import protecciones.repository.UsuarioRepository;

import java.util.List;
import java.util.Set;

@Service
public class UsuarioService {

    private static final Set<String> ROLES_VALIDOS =
            Set.of("ADMIN", "OPERADOR", "AUDITOR");

    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {

        this.usuarioRepository =
                usuarioRepository;

        this.passwordEncoder =
                passwordEncoder;
    }

    public List<UsuarioResponseDTO>
    obtenerTodos() {

        return usuarioRepository
                .findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public UsuarioResponseDTO guardar(
            UsuarioRequestDTO dto
    ) {

        validarRol(dto.getRol());

        String email =
                dto.getEmail().trim();

        if (usuarioRepository.existsByEmail(email)) {

            throw new BusinessException(
                    "Ya existe un usuario con ese email"
            );
        }

        String numeroSobre =
                dto.getNumeroSobre().trim();

        if (usuarioRepository.existsByNumeroSobre(numeroSobre)) {

            throw new BusinessException(
                    "Ya existe un usuario con ese numero de sobre"
            );
        }

        if (dto.getPassword() == null
                || dto.getPassword().isBlank()) {

            throw new BusinessException(
                    "La contrasena es obligatoria para un usuario nuevo"
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNombre(
                dto.getNombre().trim()
        );

        usuario.setApellido(
                dto.getApellido().trim()
        );

        usuario.setEmail(email);

        usuario.setNumeroSobre(numeroSobre);

        usuario.setPasswordHash(
                passwordEncoder.encode(
                        dto.getPassword()
                )
        );

        usuario.setRol(dto.getRol());

        usuario.setActivo(
                dto.getActivo() == null
                        || dto.getActivo()
        );

        Usuario guardado =
                usuarioRepository.save(usuario);

        return mapToDTO(guardado);
    }

    public UsuarioResponseDTO actualizar(
            Long id,
            UsuarioRequestDTO dto
    ) {

        validarRol(dto.getRol());

        Usuario usuario =
                usuarioRepository.findById(id)
                        .orElseThrow();

        String email =
                dto.getEmail().trim();

        usuarioRepository
                .findByEmail(email)
                .ifPresent(existente -> {

                    if (!existente.getId()
                            .equals(id)) {

                        throw new BusinessException(
                                "Ya existe un usuario con ese email"
                        );
                    }
                });

        String numeroSobre =
                dto.getNumeroSobre().trim();

        usuarioRepository
                .findByNumeroSobre(numeroSobre)
                .ifPresent(existente -> {

                    if (!existente.getId()
                            .equals(id)) {

                        throw new BusinessException(
                                "Ya existe un usuario con ese numero de sobre"
                        );
                    }
                });

        usuario.setNombre(
                dto.getNombre().trim()
        );

        usuario.setApellido(
                dto.getApellido().trim()
        );

        usuario.setEmail(email);

        usuario.setNumeroSobre(numeroSobre);

        usuario.setRol(dto.getRol());

        usuario.setActivo(
                dto.getActivo() == null
                        || dto.getActivo()
        );

        if (dto.getPassword() != null
                && !dto.getPassword().isBlank()) {

            usuario.setPasswordHash(
                    passwordEncoder.encode(
                            dto.getPassword()
                    )
            );
        }

        Usuario actualizado =
                usuarioRepository.save(usuario);

        return mapToDTO(actualizado);
    }

    private void validarRol(
            String rol
    ) {

        if (rol == null
                || !ROLES_VALIDOS.contains(rol)) {

            throw new BusinessException(
                    "El rol debe ser ADMIN, OPERADOR o AUDITOR"
            );
        }
    }

    private UsuarioResponseDTO mapToDTO(
            Usuario usuario
    ) {

        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getActivo(),
                usuario.getNumeroSobre()
        );
    }
}
