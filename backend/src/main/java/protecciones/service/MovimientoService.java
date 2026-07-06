package protecciones.service;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import protecciones.dto.MovimientoRequestDTO;
import protecciones.dto.MovimientoResponseDTO;
import protecciones.entity.Estado;
import protecciones.entity.Movimiento;
import protecciones.entity.Posicion;
import protecciones.entity.Rele;
import protecciones.entity.Usuario;
import protecciones.exception.BusinessException;
import protecciones.repository.EstadoRepository;
import protecciones.repository.MovimientoRepository;
import protecciones.repository.PosicionRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.TransicionEstadoRepository;
import protecciones.repository.UsuarioRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.apache.poi.ss.usermodel.*;
import java.io.ByteArrayOutputStream;

@Service
public class MovimientoService {

    private final MovimientoRepository
            movimientoRepository;

    private final ReleRepository
            releRepository;

    private final EstadoRepository
            estadoRepository;

    private final PosicionRepository
            posicionRepository;

    private final UsuarioRepository
            usuarioRepository;

    private final TransicionEstadoRepository
            transicionEstadoRepository;

    private final ReleBajaService releBajaService;

    public MovimientoService(
            MovimientoRepository movimientoRepository,
            ReleRepository releRepository,
            EstadoRepository estadoRepository,
            PosicionRepository posicionRepository,
            UsuarioRepository usuarioRepository,
            TransicionEstadoRepository transicionEstadoRepository,
            ReleBajaService releBajaService
    ) {

        this.movimientoRepository =
                movimientoRepository;

        this.releRepository =
                releRepository;

        this.estadoRepository =
                estadoRepository;

        this.posicionRepository =
                posicionRepository;

        this.usuarioRepository =
                usuarioRepository;

        this.transicionEstadoRepository =
                transicionEstadoRepository;

        this.releBajaService =
                releBajaService;
    }

    public List<MovimientoResponseDTO>
    obtenerTodos() {

        return movimientoRepository
                .findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public MovimientoResponseDTO guardar(
            MovimientoRequestDTO dto
    ) {

        Rele rele =
                releRepository.findById(
                        dto.getReleId()
                ).orElseThrow();

        if (!Boolean.TRUE.equals(
                rele.getActivo()
        )) {

            throw new BusinessException(
                    "No se pueden registrar movimientos sobre un relé dado de baja"
            );
        }

        Estado estadoDestino =
                estadoRepository.findById(
                        dto.getEstadoId()
                ).orElseThrow();

        Posicion posicion =
                posicionRepository.findById(
                        dto.getPosicionId()
                ).orElseThrow();

        Usuario usuario =
                usuarioRepository.findById(1L)
                        .orElseThrow();

        Optional<Movimiento> ultimoMovimiento =
                movimientoRepository
                        .findTopByReleIdOrderByFechaMovimientoDescIdDesc(
                                rele.getId()
                        );

        if (ultimoMovimiento.isPresent()) {

            Estado estadoActual =
                    ultimoMovimiento
                            .get()
                            .getEstado();

            boolean transicionPermitida =
                    transicionEstadoRepository
                            .existsByEstadoOrigenIdAndEstadoDestinoId(
                                    estadoActual.getId(),
                                    estadoDestino.getId()
                            );

            if (!transicionPermitida) {

                throw new BusinessException(
                        "Transición de estado no permitida: "
                                + estadoActual.getNombre()
                                + " -> "
                                + estadoDestino.getNombre()
                );
            }
        }

        Movimiento movimiento =
                new Movimiento();

        movimiento.setRele(
                rele
        );

        movimiento.setEstado(
                estadoDestino
        );

        movimiento.setPosicion(
                posicion
        );

        movimiento.setUsuario(
                usuario
        );

        movimiento.setFechaMovimiento(
                LocalDateTime.now()
        );

        movimiento.setNotas(
                dto.getNotas()
        );

        Movimiento guardado =
                movimientoRepository.save(
                        movimiento
                );

        /*
         * Si el relé pasa a BAJA
         * se desactiva del inventario
         */
        if (
                estadoDestino.getNombre()
                        .equalsIgnoreCase(
                                "BAJA"
                        )
        ) {

            releBajaService.aplicarBaja(
                    rele,
                    dto.getNotas()
            );

            releRepository.save(
                    rele
            );
        }

        return mapToDTO(
                guardado
        );
    }

    public MovimientoResponseDTO mapToDTO(
            Movimiento movimiento
    ) {

        return new MovimientoResponseDTO(

                movimiento.getId(),

                movimiento.getRele()
                        .getId(),

                movimiento.getRele()
                        .getNumeroSerie(),

                movimiento.getRele()
                        .getModelo()
                        .getNombre(),

                movimiento.getRele()
                        .getModelo()
                        .getMarca()
                        .getNombre(),

                movimiento.getEstado()
                        .getNombre(),

                null,

                null,

                movimiento.getPosicion()
                        .getDestino()
                        .getNombre(),

                movimiento.getPosicion()
                        .getNombre(),

                movimiento.getUsuario() != null
                        ? movimiento.getUsuario()
                                .getNombre()
                        : null,

                movimiento.getFechaMovimiento(),

                movimiento.getNotas()
        );
    }

    public byte[] exportarExcel(

        LocalDate desde,

        LocalDate hasta
        ) {

        List<Movimiento> movimientos;
        if (
                desde != null
                &&
                hasta != null
        ) {

        movimientos =
                movimientoRepository
                        .findByFechaMovimientoBetweenOrderByFechaMovimientoDesc(

                                desde.atStartOfDay(),

                                hasta.atTime(
                                        23,
                                        59,
                                        59
                                )
                        );

        } else {

        movimientos =
                movimientoRepository
                        .findAllByOrderByFechaMovimientoDesc();
        }

        try (

                Workbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream out =
                        new ByteArrayOutputStream()

        ) {

                Sheet sheet =
                        workbook.createSheet(
                                "Movimientos"
                        );

                Row header =
                        sheet.createRow(0);

                header.createCell(0)
                        .setCellValue("Relé");

                header.createCell(1)
                        .setCellValue("Marca");

                header.createCell(2)
                        .setCellValue("Modelo");

                header.createCell(3)
                        .setCellValue("Estado");

                header.createCell(4)
                        .setCellValue("Destino");

                header.createCell(5)
                        .setCellValue("Posición");

                header.createCell(6)
                        .setCellValue("Responsable");

                header.createCell(7)
                        .setCellValue("Fecha");

                header.createCell(8)
                        .setCellValue("Notas");

                int rowIndex = 1;

                for (Movimiento movimiento : movimientos) {

                Row row =
                        sheet.createRow(
                                rowIndex++
                        );

                row.createCell(0)
                        .setCellValue(
                                movimiento
                                        .getRele()
                                        .getNumeroSerie()
                        );

                row.createCell(1)
                        .setCellValue(
                                movimiento
                                        .getRele()
                                        .getModelo()
                                        .getMarca()
                                        .getNombre()
                        );

                row.createCell(2)
                        .setCellValue(
                                movimiento
                                        .getRele()
                                        .getModelo()
                                        .getNombre()
                        );

                row.createCell(3)
                        .setCellValue(
                                movimiento
                                        .getEstado()
                                        .getNombre()
                        );

                row.createCell(4)
                        .setCellValue(
                                movimiento
                                        .getPosicion()
                                        .getDestino()
                                        .getNombre()
                        );

                row.createCell(5)
                        .setCellValue(
                                movimiento
                                        .getPosicion()
                                        .getNombre()
                        );

                row.createCell(6)
                        .setCellValue(
                                movimiento
                                        .getUsuario()
                                        .getNombre()
                        );

                row.createCell(7)
                        .setCellValue(
                                movimiento
                                        .getFechaMovimiento()
                                        .toString()
                        );

                row.createCell(8)
                        .setCellValue(
                                movimiento
                                        .getNotas() != null
                                        ?
                                        movimiento.getNotas()
                                        :
                                        "-"
                        );
                }

                for (int i = 0; i < 9; i++) {

                sheet.autoSizeColumn(i);
                }

                workbook.write(out);

                return out.toByteArray();

        } catch (Exception e) {

                throw new RuntimeException(
                        "Error al generar Excel"
                );
        }
        }
}
