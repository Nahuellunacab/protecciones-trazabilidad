package protecciones.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import protecciones.dto.OrdenProvisionRequestDTO;
import protecciones.dto.OrdenProvisionResponseDTO;

import protecciones.entity.OrdenProvision;

import protecciones.exception.BusinessException;

import protecciones.repository.OrdenProvisionRepository;

import java.util.List;

@Service
public class OrdenProvisionService {

    private final OrdenProvisionRepository
            ordenProvisionRepository;

    public OrdenProvisionService(
            OrdenProvisionRepository ordenProvisionRepository
    ) {

        this.ordenProvisionRepository =
                ordenProvisionRepository;
    }

    public List<OrdenProvisionResponseDTO>
    obtenerTodos() {

        return ordenProvisionRepository
                .findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public OrdenProvisionResponseDTO guardar(
            OrdenProvisionRequestDTO dto
    ) {

        validarDuplicado(
                dto.getNumero()
        );

        OrdenProvision orden =
                new OrdenProvision();

        orden.setNumero(
                dto.getNumero().trim()
        );

        orden.setObservaciones(
                dto.getObservaciones()
        );

        OrdenProvision guardada =
                ordenProvisionRepository.save(
                        orden
                );

        return mapToDTO(
                guardada
        );
    }

    public OrdenProvisionResponseDTO actualizar(

            Long id,

            OrdenProvisionRequestDTO dto
    ) {

        OrdenProvision orden =
                ordenProvisionRepository
                        .findById(id)
                        .orElseThrow();

        orden.setNumero(
                dto.getNumero().trim()
        );

        orden.setObservaciones(
                dto.getObservaciones()
        );

        OrdenProvision actualizada =
                ordenProvisionRepository.save(
                        orden
                );

        return mapToDTO(
                actualizada
        );
    }

    public void eliminar(
            Long id
    ) {

        try {

            ordenProvisionRepository
                    .deleteById(id);

        } catch (
                DataIntegrityViolationException ex
        ) {

            throw new BusinessException(
                    "No se puede eliminar la orden porque tiene relés asociados"
            );
        }
    }

    private void validarDuplicado(
            String numero
    ) {

        List<OrdenProvision> ordenes =
                ordenProvisionRepository
                        .findAll();

        boolean existe =
                ordenes.stream()
                        .anyMatch(op ->
                                op.getNumero()
                                        .equalsIgnoreCase(
                                                numero.trim()
                                        )
                        );

        if (existe) {

            throw new BusinessException(
                    "La orden de provisión ya existe"
            );
        }
    }

    private OrdenProvisionResponseDTO
    mapToDTO(
            OrdenProvision orden
    ) {

        return new OrdenProvisionResponseDTO(

                orden.getId(),

                orden.getNumero(),

                orden.getObservaciones()
        );
    }
}