package protecciones.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import protecciones.dto.MovimientoResponseDTO;
import protecciones.dto.dashboard.DashboardKpiDTO;
import protecciones.dto.dashboard.DestinoCantidadDTO;
import protecciones.dto.dashboard.EstadoCantidadDTO;
import protecciones.dto.dashboard.MarcaCantidadDTO;
import protecciones.dto.dashboard.ModeloCantidadDTO;
import protecciones.dto.dashboard.ProveedorCantidadDTO;
import protecciones.dto.dashboard.ResumenIADTO;
import protecciones.dto.dashboard.UsuarioCantidadDTO;

import protecciones.repository.MovimientoRepository;
import protecciones.repository.ReleRepository;
import protecciones.repository.RemitoRepository;
import protecciones.repository.OrdenProvisionRepository;
import protecciones.repository.UltimoMovimientoRepository;
import protecciones.service.llm.LLMService;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class DashboardService {

    private static final int LIMITE_MOVIMIENTOS_DEFAULT = 10;

    private static final int LIMITE_MOVIMIENTOS_MAXIMO = 200;

    // El resumen ejecutivo se recalcula solo si cambio algun KPI o si pasaron
    // mas de 30 minutos: evita pegarle a la API de Gemini en cada carga
    // del dashboard cuando los datos no se movieron.
    private static final long RESUMEN_IA_TTL_MS = 30 * 60 * 1000;

    // Cuantos items de cada distribucion (marca/destino/proveedor) se le
    // pasan a la IA como contexto. No hace falta la lista completa (puede
    // tener decenas de modelos) para que el resumen sea representativo.
    private static final int TOP_N_DISTRIBUCION = 5;

    private static final String PROMPT_SISTEMA_RESUMEN =
            """
            Sos un asistente que redacta resumenes ejecutivos para el \
            dashboard de un sistema de trazabilidad de reles de proteccion de \
            EPEC Transmision. Se te va a dar informacion operativa en texto \
            plano: KPIs generales y distribucion del stock por estado, \
            marca, destino y proveedor.

            Devolves la respuesta exactamente en este formato, sin texto \
            adicional antes ni despues:
            - Primer linea: una sola oracion (maximo 22 palabras) con la \
            situacion general del stock.
            - Despues, entre 3 y 5 lineas, cada una empezando con "- ", con \
            hallazgos concretos y numericos (no genericos): estado \
            predominante del stock, marca o destino mas representado, y \
            cualquier alerta operativa (garantias vencidas, documentacion \
            pendiente, remitos u ordenes sin asociar) si el numero es mayor \
            a cero.

            Reglas: usa exclusivamente los numeros provistos, no inventes \
            datos, no agregues recomendaciones genericas, no uses \
            encabezados ni markdown (nada de **, #, etc.), español \
            rioplatense, tono profesional y directo.""";

    private static final Logger
            log = LoggerFactory.getLogger(DashboardService.class);

    private final ReleRepository
            releRepository;

    private final MovimientoRepository
            movimientoRepository;

    private final MovimientoService
            movimientoService;

    private final RemitoRepository
            remitoRepository;

    private final OrdenProvisionRepository
            ordenProvisionRepository;

    private final UltimoMovimientoRepository
            ultimoMovimientoRepository;

    private final LLMService
            llmService;

    private volatile String
            resumenIACacheado;

    private volatile String
            resumenIAFirmaCacheada;

    private volatile long
            resumenIACacheadoEn;

    public DashboardService(
            ReleRepository releRepository,
            MovimientoRepository movimientoRepository,
            MovimientoService movimientoService,
            RemitoRepository remitoRepository,
            OrdenProvisionRepository ordenProvisionRepository,
            UltimoMovimientoRepository ultimoMovimientoRepository,
            LLMService llmService
    ) {

        this.releRepository =
                releRepository;

        this.movimientoRepository =
                movimientoRepository;

        this.movimientoService =
                movimientoService;

        this.remitoRepository =
                remitoRepository;

        this.ordenProvisionRepository =
                ordenProvisionRepository;

        this.ultimoMovimientoRepository =
                ultimoMovimientoRepository;

        this.llmService =
                llmService;
    }

    public DashboardKpiDTO
    obtenerKpis() {

        long totalReles =
                releRepository
                        .count();

        long activos =
                releRepository
                        .countByActivoTrue();

        long baja =
                releRepository
                        .countByActivoFalse();

        // Solo relés activos: uno dado de baja no debería seguir
        // contando como "garantía vencida" pendiente de gestionar.
        long garantiasVencidas =
                releRepository
                        .countByActivoTrueAndFinGarantiaBefore(
                                LocalDate.now()
                        );

        long relesSinDocumentacion =
                releRepository
                        .countSinDocumentacion();

        long relesDocumentacionSinArchivo =
                releRepository
                        .countDocumentacionSinArchivo();

        long remitosPendientes =
                remitoRepository
                        .countByAsociadoFalse();

        long ordenesPendientes =
                ordenProvisionRepository
                        .countByAsociadoFalse();

        long relesSinHistorial =
                releRepository
                        .countSinHistorial();

        return new DashboardKpiDTO(

                totalReles,

                activos,

                baja,

                garantiasVencidas,

                relesSinDocumentacion,

                relesDocumentacionSinArchivo,

                remitosPendientes,

                ordenesPendientes,

                relesSinHistorial
        );
    }

    public ResumenIADTO
    obtenerResumenIA() {

        if (!llmService.estaDisponible()) {

            return new ResumenIADTO(null);
        }

        DashboardKpiDTO kpis =
                obtenerKpis();

        List<EstadoCantidadDTO> porEstado =
                obtenerRelesPorEstado();

        List<MarcaCantidadDTO> porMarca =
                obtenerRelesPorMarca();

        List<DestinoCantidadDTO> porDestino =
                obtenerRelesPorDestino();

        List<ProveedorCantidadDTO> porProveedor =
                obtenerRelesPorProveedor();

        String firmaActual =
                construirFirmaKpis(kpis, porEstado, porMarca, porDestino, porProveedor);

        boolean cacheVigente =

                resumenIACacheado != null

                && firmaActual.equals(resumenIAFirmaCacheada)

                && (System.currentTimeMillis() - resumenIACacheadoEn) < RESUMEN_IA_TTL_MS;

        if (cacheVigente) {

            return new ResumenIADTO(resumenIACacheado);
        }

        try {

            String resumen =
                    llmService.generarTexto(
                            PROMPT_SISTEMA_RESUMEN,
                            construirPromptResumen(kpis, porEstado, porMarca, porDestino, porProveedor),
                            600
                    );

            resumenIACacheado =
                    resumen;

            resumenIAFirmaCacheada =
                    firmaActual;

            resumenIACacheadoEn =
                    System.currentTimeMillis();

            return new ResumenIADTO(resumen);

        } catch (Exception e) {

            // Es una funcionalidad informativa, no operativa: si Gemini
            // no responde (timeout, 429, etc.) el dashboard sigue andando
            // sin el resumen en vez de romper la carga de KPIs.
            log.warn(
                    "No se pudo generar el resumen ejecutivo con IA: {}",
                    e.getMessage()
            );

            return new ResumenIADTO(null);
        }
    }

    private String construirFirmaKpis(
            DashboardKpiDTO kpis,
            List<EstadoCantidadDTO> porEstado,
            List<MarcaCantidadDTO> porMarca,
            List<DestinoCantidadDTO> porDestino,
            List<ProveedorCantidadDTO> porProveedor
    ) {

        return kpis.getTotalReles()
                + "|" + kpis.getRelesActivos()
                + "|" + kpis.getRelesBaja()
                + "|" + kpis.getGarantiasVencidas()
                + "|" + kpis.getRelesSinDocumentacion()
                + "|" + kpis.getRelesDocumentacionSinArchivo()
                + "|" + kpis.getRemitosPendientes()
                + "|" + kpis.getOrdenesPendientes()
                + "|" + kpis.getRelesSinHistorial()
                + "|" + firmaDistribucion(porEstado, EstadoCantidadDTO::getEstado, EstadoCantidadDTO::getCantidad)
                + "|" + firmaDistribucion(porMarca, MarcaCantidadDTO::getMarca, MarcaCantidadDTO::getCantidad)
                + "|" + firmaDistribucion(porDestino, DestinoCantidadDTO::getDestino, DestinoCantidadDTO::getCantidad)
                + "|" + firmaDistribucion(porProveedor, ProveedorCantidadDTO::getProveedor, ProveedorCantidadDTO::getCantidad);
    }

    private <T> String firmaDistribucion(
            List<T> items,
            java.util.function.Function<T, String> etiqueta,
            java.util.function.Function<T, Long> cantidad
    ) {

        return items.stream()
                .map(item -> etiqueta.apply(item) + ":" + cantidad.apply(item))
                .reduce("", (a, b) -> a + "," + b);
    }

    private String construirPromptResumen(
            DashboardKpiDTO kpis,
            List<EstadoCantidadDTO> porEstado,
            List<MarcaCantidadDTO> porMarca,
            List<DestinoCantidadDTO> porDestino,
            List<ProveedorCantidadDTO> porProveedor
    ) {

        StringBuilder prompt =
                new StringBuilder();

        prompt.append(
                """
                KPIs generales:
                Total de reles: %d
                Reles activos: %d
                Reles dados de baja: %d
                Garantias vencidas: %d
                Reles sin documentacion vinculada: %d
                Documentacion vinculada sin archivo adjunto: %d
                Remitos sin asociar: %d
                Ordenes de provision sin asociar: %d
                Reles sin historial de movimientos: %d

                """.formatted(
                        kpis.getTotalReles(),
                        kpis.getRelesActivos(),
                        kpis.getRelesBaja(),
                        kpis.getGarantiasVencidas(),
                        kpis.getRelesSinDocumentacion(),
                        kpis.getRelesDocumentacionSinArchivo(),
                        kpis.getRemitosPendientes(),
                        kpis.getOrdenesPendientes(),
                        kpis.getRelesSinHistorial()
                )
        );

        agregarDistribucion(prompt, "Distribucion por estado operativo", porEstado, EstadoCantidadDTO::getEstado, EstadoCantidadDTO::getCantidad);

        agregarDistribucion(prompt, "Marcas mas representadas", porMarca, MarcaCantidadDTO::getMarca, MarcaCantidadDTO::getCantidad);

        agregarDistribucion(prompt, "Destinos con mas reles", porDestino, DestinoCantidadDTO::getDestino, DestinoCantidadDTO::getCantidad);

        agregarDistribucion(prompt, "Proveedores", porProveedor, ProveedorCantidadDTO::getProveedor, ProveedorCantidadDTO::getCantidad);

        return prompt.toString();
    }

    private <T> void agregarDistribucion(
            StringBuilder prompt,
            String titulo,
            List<T> items,
            java.util.function.Function<T, String> etiqueta,
            java.util.function.Function<T, Long> cantidad
    ) {

        if (items.isEmpty()) {

            return;
        }

        prompt.append(titulo)
                .append(":\n");

        items.stream()
                .limit(TOP_N_DISTRIBUCION)
                .forEach(item -> prompt
                        .append("- ")
                        .append(etiqueta.apply(item))
                        .append(": ")
                        .append(cantidad.apply(item))
                        .append("\n")
                );

        prompt.append("\n");
    }

    public List<MovimientoResponseDTO>
    obtenerUltimosMovimientos(
            Integer limite,
            LocalDate desde,
            LocalDate hasta
    ) {

        int limiteSeguro =
                limite == null
                        ? LIMITE_MOVIMIENTOS_DEFAULT
                        : Math.min(
                                Math.max(limite, 1),
                                LIMITE_MOVIMIENTOS_MAXIMO
                        );

        LocalDateTime desdeDateTime =
                desde != null
                        ? desde.atStartOfDay()
                        : null;

        LocalDateTime hastaDateTime =
                hasta != null
                        ? hasta.atTime(23, 59, 59)
                        : null;

        Pageable pageable =
                PageRequest.of(0, limiteSeguro);

        return movimientoRepository
                .buscarUltimosMovimientos(
                        desdeDateTime,
                        hastaDateTime,
                        pageable
                )
                .stream()
                .map(movimientoService::mapToDTO)
                .toList();
    }

    public List<MarcaCantidadDTO>
    obtenerRelesPorMarca() {

        return releRepository
                .contarRelesPorMarca();
    }

    public List<ModeloCantidadDTO>
    obtenerRelesPorModelo() {

        return releRepository
                .contarRelesPorModelo();
    }

    // Reemplaza el conteo hardcodeado por nombre de estado (INSTALADO,
    // EN ENSAYO, etc.) que quedó desactualizado respecto a la máquina
    // de estados vigente (ver V20__actualizar_transiciones_estado.sql).
    // Se calcula dinámicamente contra la tabla estado real, así que
    // cualquier estado nuevo agregado por Flyway aparece solo, sin
    // tocar código Java.
    public List<EstadoCantidadDTO>
    obtenerRelesPorEstado() {

        return ultimoMovimientoRepository
                .contarPorEstado()
                .stream()
                .map(fila -> new EstadoCantidadDTO(
                        (String) fila[0],
                        (Long) fila[1]
                ))
                .toList();
    }

    public List<DestinoCantidadDTO>
    obtenerRelesPorDestino() {

        return ultimoMovimientoRepository
                .contarPorDestino()
                .stream()
                .map(fila -> new DestinoCantidadDTO(
                        (String) fila[0],
                        (Long) fila[1]
                ))
                .toList();
    }

    public List<ProveedorCantidadDTO>
    obtenerRelesPorProveedor() {

        return releRepository
                .contarRelesPorProveedor();
    }

    public List<UsuarioCantidadDTO>
    obtenerMovimientosPorUsuario() {

        return movimientoRepository
                .contarMovimientosPorUsuario();
    }

    public byte[] exportarResumen() {

        DashboardKpiDTO kpis =
                obtenerKpis();

        List<EstadoCantidadDTO> porEstado =
                obtenerRelesPorEstado();

        List<MarcaCantidadDTO> porMarca =
                obtenerRelesPorMarca();

        List<ModeloCantidadDTO> porModelo =
                obtenerRelesPorModelo();

        List<DestinoCantidadDTO> porDestino =
                obtenerRelesPorDestino();

        List<ProveedorCantidadDTO> porProveedor =
                obtenerRelesPorProveedor();

        List<UsuarioCantidadDTO> porUsuario =
                obtenerMovimientosPorUsuario();

        try (

                Workbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream out =
                        new ByteArrayOutputStream()

        ) {

            Sheet resumen =
                    workbook.createSheet("Resumen");

            int fila = 0;

            fila = escribirFilaKpi(resumen, fila, "Total de relés", kpis.getTotalReles());
            fila = escribirFilaKpi(resumen, fila, "Relés activos", kpis.getRelesActivos());
            fila = escribirFilaKpi(resumen, fila, "Relés dados de baja", kpis.getRelesBaja());
            fila = escribirFilaKpi(resumen, fila, "Garantías vencidas", kpis.getGarantiasVencidas());
            fila = escribirFilaKpi(resumen, fila, "Relés sin documentación", kpis.getRelesSinDocumentacion());
            fila = escribirFilaKpi(resumen, fila, "Documentación vinculada sin archivo", kpis.getRelesDocumentacionSinArchivo());
            fila = escribirFilaKpi(resumen, fila, "Remitos sin asociar", kpis.getRemitosPendientes());
            fila = escribirFilaKpi(resumen, fila, "Órdenes de provisión sin asociar", kpis.getOrdenesPendientes());
            escribirFilaKpi(resumen, fila, "Relés sin historial", kpis.getRelesSinHistorial());

            resumen.autoSizeColumn(0);
            resumen.autoSizeColumn(1);

            crearHojaCantidad(
                    workbook,
                    "Por Estado",
                    "Estado",
                    porEstado.stream().map(EstadoCantidadDTO::getEstado).toList(),
                    porEstado.stream().map(EstadoCantidadDTO::getCantidad).toList()
            );

            crearHojaCantidad(
                    workbook,
                    "Por Marca",
                    "Marca",
                    porMarca.stream().map(MarcaCantidadDTO::getMarca).toList(),
                    porMarca.stream().map(MarcaCantidadDTO::getCantidad).toList()
            );

            crearHojaCantidad(
                    workbook,
                    "Por Modelo",
                    "Modelo",
                    porModelo.stream().map(ModeloCantidadDTO::getModelo).toList(),
                    porModelo.stream().map(ModeloCantidadDTO::getCantidad).toList()
            );

            crearHojaCantidad(
                    workbook,
                    "Por Destino",
                    "Destino",
                    porDestino.stream().map(DestinoCantidadDTO::getDestino).toList(),
                    porDestino.stream().map(DestinoCantidadDTO::getCantidad).toList()
            );

            crearHojaCantidad(
                    workbook,
                    "Por Proveedor",
                    "Proveedor",
                    porProveedor.stream().map(ProveedorCantidadDTO::getProveedor).toList(),
                    porProveedor.stream().map(ProveedorCantidadDTO::getCantidad).toList()
            );

            crearHojaCantidad(
                    workbook,
                    "Movimientos por Usuario",
                    "Usuario",
                    porUsuario.stream().map(UsuarioCantidadDTO::getUsuario).toList(),
                    porUsuario.stream().map(UsuarioCantidadDTO::getCantidad).toList()
            );

            workbook.write(out);

            return out.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Error al generar el Excel del dashboard"
            );
        }
    }

    public byte[] exportarResumenPdf() {

        DashboardKpiDTO kpis =
                obtenerKpis();

        List<EstadoCantidadDTO> porEstado =
                obtenerRelesPorEstado();

        List<MarcaCantidadDTO> porMarca =
                obtenerRelesPorMarca();

        List<ModeloCantidadDTO> porModelo =
                obtenerRelesPorModelo();

        List<DestinoCantidadDTO> porDestino =
                obtenerRelesPorDestino();

        List<ProveedorCantidadDTO> porProveedor =
                obtenerRelesPorProveedor();

        List<UsuarioCantidadDTO> porUsuario =
                obtenerMovimientosPorUsuario();

        Document document =
                new Document(PageSize.A4, 40, 40, 50, 40);

        try (

                ByteArrayOutputStream out =
                        new ByteArrayOutputStream()

        ) {

            PdfWriter.getInstance(document, out);

            document.open();

            Font tituloFont =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);

            Font subtituloFont =
                    FontFactory.getFont(FontFactory.HELVETICA, 10, Font.ITALIC);

            Font seccionFont =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13);

            Font celdaHeaderFont =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);

            Font celdaFont =
                    FontFactory.getFont(FontFactory.HELVETICA, 10);

            Paragraph titulo =
                    new Paragraph("Reporte de Trazabilidad de Relés", tituloFont);

            titulo.setSpacingAfter(4);

            document.add(titulo);

            Paragraph fechaGeneracion =
                    new Paragraph(
                            "Generado el "
                                    + LocalDateTime.now().format(
                                            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
                                    ),
                            subtituloFont
                    );

            fechaGeneracion.setSpacingAfter(18);

            document.add(fechaGeneracion);

            document.add(
                    tituloSeccion("Resumen General", seccionFont)
            );

            PdfPTable resumen =
                    new PdfPTable(2);

            resumen.setWidthPercentage(100);

            resumen.setWidths(new float[] { 3f, 1f });

            resumen.setSpacingAfter(18);

            agregarFilaResumen(resumen, "Total de relés", kpis.getTotalReles(), celdaHeaderFont, celdaFont);
            agregarFilaResumen(resumen, "Relés activos", kpis.getRelesActivos(), celdaHeaderFont, celdaFont);
            agregarFilaResumen(resumen, "Relés dados de baja", kpis.getRelesBaja(), celdaHeaderFont, celdaFont);
            agregarFilaResumen(resumen, "Garantías vencidas", kpis.getGarantiasVencidas(), celdaHeaderFont, celdaFont);
            agregarFilaResumen(resumen, "Relés sin documentación", kpis.getRelesSinDocumentacion(), celdaHeaderFont, celdaFont);
            agregarFilaResumen(resumen, "Documentación vinculada sin archivo", kpis.getRelesDocumentacionSinArchivo(), celdaHeaderFont, celdaFont);
            agregarFilaResumen(resumen, "Remitos sin asociar", kpis.getRemitosPendientes(), celdaHeaderFont, celdaFont);
            agregarFilaResumen(resumen, "Órdenes de provisión sin asociar", kpis.getOrdenesPendientes(), celdaHeaderFont, celdaFont);
            agregarFilaResumen(resumen, "Relés sin historial", kpis.getRelesSinHistorial(), celdaHeaderFont, celdaFont);

            document.add(resumen);

            agregarTablaCantidadPdf(
                    document,
                    "Distribución por Estado",
                    "Estado",
                    porEstado.stream().map(EstadoCantidadDTO::getEstado).toList(),
                    porEstado.stream().map(EstadoCantidadDTO::getCantidad).toList(),
                    seccionFont,
                    celdaHeaderFont,
                    celdaFont
            );

            agregarTablaCantidadPdf(
                    document,
                    "Distribución por Marca",
                    "Marca",
                    porMarca.stream().map(MarcaCantidadDTO::getMarca).toList(),
                    porMarca.stream().map(MarcaCantidadDTO::getCantidad).toList(),
                    seccionFont,
                    celdaHeaderFont,
                    celdaFont
            );

            agregarTablaCantidadPdf(
                    document,
                    "Distribución por Modelo",
                    "Modelo",
                    porModelo.stream().map(ModeloCantidadDTO::getModelo).toList(),
                    porModelo.stream().map(ModeloCantidadDTO::getCantidad).toList(),
                    seccionFont,
                    celdaHeaderFont,
                    celdaFont
            );

            agregarTablaCantidadPdf(
                    document,
                    "Distribución por Destino",
                    "Destino",
                    porDestino.stream().map(DestinoCantidadDTO::getDestino).toList(),
                    porDestino.stream().map(DestinoCantidadDTO::getCantidad).toList(),
                    seccionFont,
                    celdaHeaderFont,
                    celdaFont
            );

            agregarTablaCantidadPdf(
                    document,
                    "Distribución por Proveedor",
                    "Proveedor",
                    porProveedor.stream().map(ProveedorCantidadDTO::getProveedor).toList(),
                    porProveedor.stream().map(ProveedorCantidadDTO::getCantidad).toList(),
                    seccionFont,
                    celdaHeaderFont,
                    celdaFont
            );

            agregarTablaCantidadPdf(
                    document,
                    "Movimientos por Usuario",
                    "Usuario",
                    porUsuario.stream().map(UsuarioCantidadDTO::getUsuario).toList(),
                    porUsuario.stream().map(UsuarioCantidadDTO::getCantidad).toList(),
                    seccionFont,
                    celdaHeaderFont,
                    celdaFont
            );

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Error al generar el PDF del dashboard",
                    e
            );
        }
    }

    private Paragraph tituloSeccion(
            String texto,
            Font font
    ) {

        Paragraph paragraph =
                new Paragraph(texto, font);

        paragraph.setSpacingBefore(10);

        paragraph.setSpacingAfter(8);

        return paragraph;
    }

    private void agregarFilaResumen(
            PdfPTable tabla,
            String etiqueta,
            long valor,
            Font etiquetaFont,
            Font valorFont
    ) {

        PdfPCell celdaEtiqueta =
                new PdfPCell(new Phrase(etiqueta, etiquetaFont));

        celdaEtiqueta.setBorderColor(java.awt.Color.LIGHT_GRAY);

        celdaEtiqueta.setPadding(5);

        PdfPCell celdaValor =
                new PdfPCell(new Phrase(String.valueOf(valor), valorFont));

        celdaValor.setBorderColor(java.awt.Color.LIGHT_GRAY);

        celdaValor.setPadding(5);

        tabla.addCell(celdaEtiqueta);

        tabla.addCell(celdaValor);
    }

    private void agregarTablaCantidadPdf(
            Document document,
            String tituloTabla,
            String etiquetaColumna,
            List<String> etiquetas,
            List<Long> cantidades,
            Font seccionFont,
            Font headerFont,
            Font celdaFont
    ) throws com.lowagie.text.DocumentException {

        document.add(
                tituloSeccion(tituloTabla, seccionFont)
        );

        if (etiquetas.isEmpty()) {

            document.add(
                    new Paragraph("Sin datos.", celdaFont)
            );

            return;
        }

        PdfPTable tabla =
                new PdfPTable(2);

        tabla.setWidthPercentage(100);

        tabla.setWidths(new float[] { 3f, 1f });

        tabla.setSpacingAfter(14);

        PdfPCell headerEtiqueta =
                new PdfPCell(new Phrase(etiquetaColumna, headerFont));

        headerEtiqueta.setPadding(5);

        PdfPCell headerCantidad =
                new PdfPCell(new Phrase("Cantidad", headerFont));

        headerCantidad.setPadding(5);

        tabla.addCell(headerEtiqueta);

        tabla.addCell(headerCantidad);

        for (int i = 0; i < etiquetas.size(); i++) {

            PdfPCell celdaEtiqueta =
                    new PdfPCell(new Phrase(etiquetas.get(i), celdaFont));

            celdaEtiqueta.setPadding(4);

            PdfPCell celdaCantidad =
                    new PdfPCell(new Phrase(String.valueOf(cantidades.get(i)), celdaFont));

            celdaCantidad.setPadding(4);

            tabla.addCell(celdaEtiqueta);

            tabla.addCell(celdaCantidad);
        }

        document.add(tabla);
    }

    private int escribirFilaKpi(
            Sheet sheet,
            int filaIndex,
            String etiqueta,
            long valor
    ) {

        Row row =
                sheet.createRow(filaIndex);

        row.createCell(0)
                .setCellValue(etiqueta);

        row.createCell(1)
                .setCellValue(valor);

        return filaIndex + 1;
    }

    private void crearHojaCantidad(
            Workbook workbook,
            String nombreHoja,
            String etiquetaColumna,
            List<String> etiquetas,
            List<Long> cantidades
    ) {

        Sheet sheet =
                workbook.createSheet(nombreHoja);

        Row header =
                sheet.createRow(0);

        header.createCell(0)
                .setCellValue(etiquetaColumna);

        header.createCell(1)
                .setCellValue("Cantidad");

        for (int i = 0; i < etiquetas.size(); i++) {

            Row row =
                    sheet.createRow(i + 1);

            row.createCell(0)
                    .setCellValue(etiquetas.get(i));

            row.createCell(1)
                    .setCellValue(cantidades.get(i));
        }

        sheet.autoSizeColumn(0);

        sheet.autoSizeColumn(1);
    }
}
