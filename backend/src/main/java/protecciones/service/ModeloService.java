package protecciones.service;

import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.stereotype.Service;

import protecciones.dto.ModeloRequestDTO;
import protecciones.dto.ModeloResponseDTO;

import protecciones.entity.Marca;
import protecciones.entity.Modelo;
import protecciones.entity.Tipo;

import protecciones.exception.BusinessException;

import protecciones.repository.MarcaRepository;
import protecciones.repository.ModeloRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.TipoRepository;

import java.util.List;

@Service
public class ModeloService {

    private final ModeloRepository
            modeloRepository;

    private final MarcaRepository
            marcaRepository;

    private final TipoRepository
            tipoRepository;

    private final ReleRepository
            releRepository;

    public ModeloService(

            ModeloRepository modeloRepository,

            MarcaRepository marcaRepository,

            TipoRepository tipoRepository,

            ReleRepository releRepository
    ) {

        this.modeloRepository =
                modeloRepository;

        this.marcaRepository =
                marcaRepository;

        this.tipoRepository =
                tipoRepository;

        this.releRepository =
                releRepository;
    }

    public List<ModeloResponseDTO>
    obtenerTodos() {

        return modeloRepository
                .findAllByOrderByNombreAsc()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ModeloResponseDTO>
    obtenerPorMarca(Long marcaId) {

        return modeloRepository
                .findByMarcaId(marcaId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public ModeloResponseDTO guardar(
            ModeloRequestDTO dto
    ) {

        validarDuplicado(dto);

        Marca marca =
                marcaRepository.findById(
                        dto.getMarcaId()
                ).orElseThrow();

        Tipo tipo =
                tipoRepository.findById(
                        dto.getTipoId()
                ).orElseThrow();

        Modelo modelo = new Modelo();

        modelo.setNombre(
                dto.getNombre().trim()
        );

        modelo.setTensionDesde(
                dto.getTensionDesde()
        );

        modelo.setTensionHasta(
                dto.getTensionHasta()
        );

        modelo.setTipoTension(
                dto.getTipoTension().trim()
        );

        modelo.setMarca(marca);

        modelo.setTipo(tipo);

        Modelo guardado =
                modeloRepository.save(modelo);

        return mapToDTO(guardado);
    }

    public ModeloResponseDTO actualizar(
            Long id,
            ModeloRequestDTO dto
    ) {

        Modelo modelo =
                modeloRepository.findById(id)
                        .orElseThrow();

        modeloRepository
                .findByNombreIgnoreCaseAndMarcaId(
                        dto.getNombre(),
                        dto.getMarcaId()
                )
                .ifPresent(existente -> {

                    if (!existente.getId()
                            .equals(id)) {

                        throw new BusinessException(
                                "Ya existe un modelo con ese nombre para esa marca"
                        );
                    }
                });

        Marca marca =
                marcaRepository.findById(
                        dto.getMarcaId()
                ).orElseThrow();

        Tipo tipo =
                tipoRepository.findById(
                        dto.getTipoId()
                ).orElseThrow();

        modelo.setNombre(
                dto.getNombre().trim()
        );

        modelo.setTensionDesde(
                dto.getTensionDesde()
        );

        modelo.setTensionHasta(
                dto.getTensionHasta()
        );

        modelo.setTipoTension(
                dto.getTipoTension().trim()
        );

        modelo.setMarca(marca);

        modelo.setTipo(tipo);

        Modelo actualizado =
                modeloRepository.save(modelo);

        return mapToDTO(actualizado);
    }

    public void eliminar(Long id) {

        try {

            modeloRepository.deleteById(id);

        } catch (
                DataIntegrityViolationException ex
        ) {

            throw new BusinessException(
                    "No se puede eliminar porque el modelo está siendo utilizado"
            );
        }
    }

    private void validarDuplicado(
            ModeloRequestDTO dto
    ) {

        modeloRepository
                .findByNombreIgnoreCaseAndMarcaId(
                        dto.getNombre(),
                        dto.getMarcaId()
                )
                .ifPresent(modelo -> {

                    throw new BusinessException(
                            "Ya existe un modelo con ese nombre para esa marca"
                    );
                });
    }

    private ModeloResponseDTO
    mapToDTO(
            Modelo modelo
    ) {

        long activos =
                releRepository
                        .countByModeloIdAndActivoTrue(
                                modelo.getId()
                        );

        long baja =
                releRepository
                        .countByModeloIdAndActivoFalse(
                                modelo.getId()
                        );

        long total =
                activos + baja;

        return new ModeloResponseDTO(

                modelo.getId(),

                modelo.getNombre(),

                modelo.getTensionDesde(),

                modelo.getTensionHasta(),

                modelo.getTipoTension(),

                modelo.getMarca()
                        .getId(),

                modelo.getMarca()
                        .getNombre(),

                modelo.getTipo()
                        .getId(),

                modelo.getTipo()
                        .getNombre(),

                activos,

                baja,

                total
        );
    }
}