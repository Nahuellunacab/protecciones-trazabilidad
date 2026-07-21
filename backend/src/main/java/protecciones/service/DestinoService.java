package protecciones.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import protecciones.dto.DestinoRequestDTO;
import protecciones.dto.DestinoResponseDTO;
import protecciones.dto.DestinoSimilarDTO;

import protecciones.entity.Destino;
import protecciones.entity.Localidad;

import protecciones.exception.BusinessException;

import protecciones.repository.DestinoRepository;
import protecciones.repository.LocalidadRepository;
import protecciones.repository.UltimoMovimientoRepository;

import protecciones.service.similarity.CandidatoSimilitud;
import protecciones.service.similarity.ResultadoSimilitud;
import protecciones.service.similarity.SimilarityService;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class DestinoService {

    // Siglas y terminos propios de la nomenclatura de estaciones
    // transformadoras que suelen generar "duplicados" con nombres
    // distintos para el mismo destino real (ver SimilarityService).
    private static final Set<String> PALABRAS_IGNORADAS_SIMILITUD =
            Set.of(
                    "ET",
                    "E",
                    "T",
                    "ESTACION",
                    "TRANSFORMADORA"
            );

    private final DestinoRepository
            destinoRepository;

    private final LocalidadRepository
            localidadRepository;

    private final UltimoMovimientoRepository
            ultimoMovimientoRepository;

    private final SimilarityService
            similarityService;

    public DestinoService(
            DestinoRepository destinoRepository,
            LocalidadRepository localidadRepository,
            UltimoMovimientoRepository ultimoMovimientoRepository,
            SimilarityService similarityService
    ) {

        this.destinoRepository =
                destinoRepository;

        this.localidadRepository =
                localidadRepository;

        this.ultimoMovimientoRepository =
                ultimoMovimientoRepository;

        this.similarityService =
                similarityService;
    }

    public List<DestinoResponseDTO>
    obtenerTodos() {

        return destinoRepository
                .findAllByOrderByNombreAsc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<DestinoResponseDTO>
        obtenerPorLocalidad(
                Long localidadId
        ) {

        return destinoRepository
                .findByLocalidadIdOrderByNombreAsc(
                        localidadId
                )
                .stream()
                .map(this::mapToDTO)
                .toList();
        }

    // Solo advierte: nunca bloquea el alta. El duplicado exacto sigue
    // rechazandose en guardar()/actualizar() via validarDuplicado().
    public List<DestinoSimilarDTO> buscarSimilares(
            String nombre
    ) {

        if (nombre == null
                || nombre.isBlank()) {

            return List.of();
        }

        List<CandidatoSimilitud> candidatos =
                destinoRepository
                        .findAllByOrderByNombreAsc()
                        .stream()
                        .map(destino -> new CandidatoSimilitud(
                                destino.getId(),
                                destino.getNombre()
                        ))
                        .toList();

        List<ResultadoSimilitud> resultados =
                similarityService.buscarSimilares(
                        nombre,
                        candidatos,
                        PALABRAS_IGNORADAS_SIMILITUD
                );

        if (resultados.isEmpty()) {

            return List.of();
        }

        Map<Long, Long> cantidadRelesPorDestinoId =
                ultimoMovimientoRepository
                        .contarPorDestinoId()
                        .stream()
                        .collect(Collectors.toMap(
                                fila -> (Long) fila[0],
                                fila -> (Long) fila[1]
                        ));

        Map<Long, Destino> destinosPorId =
                destinoRepository
                        .findAllById(
                                resultados.stream()
                                        .map(ResultadoSimilitud::getId)
                                        .toList()
                        )
                        .stream()
                        .collect(Collectors.toMap(
                                Destino::getId,
                                Function.identity()
                        ));

        return resultados.stream()
                .map(resultado -> {

                    Destino destino =
                            destinosPorId.get(resultado.getId());

                    return new DestinoSimilarDTO(

                            destino.getId(),

                            destino.getNombre(),

                            destino.getLocalidad()
                                    .getId(),

                            destino.getLocalidad()
                                    .getNombre(),

                            destino.getLocalidad()
                                    .getProvincia()
                                    .getNombre(),

                            cantidadRelesPorDestinoId
                                    .getOrDefault(destino.getId(), 0L),

                            resultado.getSimilitud()
                    );
                })
                .toList();
    }

    public DestinoResponseDTO guardar(
            DestinoRequestDTO dto
    ) {

        validarDuplicado(
                dto.getNombre()
        );

        Localidad localidad =
                localidadRepository
                        .findById(
                                dto.getLocalidadId()
                        )
                        .orElseThrow();

        Destino destino =
                new Destino();

        destino.setNombre(
                dto.getNombre().trim()
        );

        destino.setLocalidad(
                localidad
        );

        Destino guardado =
                destinoRepository.save(
                        destino
                );

        return mapToDTO(
                guardado
        );
    }

    public DestinoResponseDTO actualizar(
            Long id,
            DestinoRequestDTO dto
    ) {

        Destino destino =
                destinoRepository.findById(id)
                        .orElseThrow();

        Localidad localidad =
                localidadRepository
                        .findById(
                                dto.getLocalidadId()
                        )
                        .orElseThrow();

        destinoRepository
                .findByNombreIgnoreCase(
                        dto.getNombre()
                )
                .ifPresent(existente -> {

                    if (!existente.getId()
                            .equals(id)) {

                        throw new BusinessException(
                                "Ya existe un destino con ese nombre"
                        );
                    }
                });

        destino.setNombre(
                dto.getNombre().trim()
        );

        destino.setLocalidad(
                localidad
        );

        Destino actualizado =
                destinoRepository.save(
                        destino
                );

        return mapToDTO(
                actualizado
        );
    }

    public void eliminar(
            Long id
    ) {

        try {

            destinoRepository
                    .deleteById(id);

        } catch (
                DataIntegrityViolationException ex
        ) {

            throw new BusinessException(
                    "No se puede eliminar el destino porque tiene posiciones asociadas"
            );
        }
    }

    private void validarDuplicado(
            String nombre
    ) {

        destinoRepository
                .findByNombreIgnoreCase(
                        nombre.trim()
                )
                .ifPresent(destino -> {

                    throw new BusinessException(
                            "El destino ya existe"
                    );
                });

    }

    

    private DestinoResponseDTO
    mapToDTO(
            Destino destino
    ) {

        return new DestinoResponseDTO(

                destino.getId(),

                destino.getNombre(),

                destino.getLocalidad()
                        .getNombre(),

                destino.getLocalidad()
                        .getProvincia()
                        .getNombre()
        );
    }
}