package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.dto.ReleRequestDTO;
import protecciones.dto.ReleResponseDTO;
import protecciones.entity.Modelo;
import protecciones.entity.Rele;
import protecciones.entity.Remito;
import protecciones.repository.ModeloRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.RemitoRepository;

import java.util.List;

@Service
public class ReleService {

    private final ReleRepository releRepository;
    private final ModeloRepository modeloRepository;
    private final RemitoRepository remitoRepository;

    public ReleService(ReleRepository releRepository,
                       ModeloRepository modeloRepository,
                       RemitoRepository remitoRepository) {

        this.releRepository = releRepository;
        this.modeloRepository = modeloRepository;
        this.remitoRepository = remitoRepository;
    }

    public List<ReleResponseDTO> obtenerTodos() {

        return releRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public ReleResponseDTO guardar(ReleRequestDTO dto) {

        Modelo modelo = modeloRepository.findById(dto.getModeloId())
                .orElseThrow(() -> new RuntimeException("Modelo no encontrado"));

        Remito remito = null;

        if (dto.getRemitoId() != null) {
            remito = remitoRepository.findById(dto.getRemitoId())
                    .orElseThrow(() -> new RuntimeException("Remito no encontrado"));
        }

        Rele rele = new Rele();

        rele.setNumeroSerie(dto.getNumeroSerie());
        rele.setGarantiaMeses(dto.getGarantiaMeses());
        rele.setModelo(modelo);
        rele.setRemito(remito);

        Rele releGuardado = releRepository.save(rele);

        return mapToResponseDTO(releGuardado);
    }

    private ReleResponseDTO mapToResponseDTO(Rele rele) {

        return new ReleResponseDTO(
                rele.getId(),
                rele.getNumeroSerie(),
                rele.getGarantiaMeses(),
                rele.getModelo().getNombre(),
                rele.getModelo().getMarca().getNombre()
        );
    }
}