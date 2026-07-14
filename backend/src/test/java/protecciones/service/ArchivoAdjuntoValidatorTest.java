package protecciones.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import protecciones.exception.BusinessException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ArchivoAdjuntoValidatorTest {

    private static final byte[] CONTENIDO_PDF_VALIDO =
            "%PDF-1.4 contenido de prueba".getBytes(StandardCharsets.UTF_8);

    @Test
    void validarPdf_archivoVacio_lanzaBusinessException() {

        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "remito.pdf", "application/pdf", new byte[0]
        );

        assertThatThrownBy(() -> ArchivoAdjuntoValidator.validarPdf(archivo))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("adjuntar un archivo");
    }

    @Test
    void validarPdf_extensionDistintaDePdf_lanzaBusinessException() {

        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "remito.exe", "application/pdf", CONTENIDO_PDF_VALIDO
        );

        assertThatThrownBy(() -> ArchivoAdjuntoValidator.validarPdf(archivo))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Solo se permiten archivos PDF");
    }

    @Test
    void validarPdf_contentTypeDistintoDeApplicationPdf_lanzaBusinessException() {

        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "remito.pdf", "image/png", CONTENIDO_PDF_VALIDO
        );

        assertThatThrownBy(() -> ArchivoAdjuntoValidator.validarPdf(archivo))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Solo se permiten archivos PDF");
    }

    @Test
    void validarPdf_extensionYContentTypeCorrectosPeroSinFirmaPdf_lanzaBusinessException() {

        MockMultipartFile archivo = new MockMultipartFile(
                "archivo",
                "remito.pdf",
                "application/pdf",
                "esto no es un pdf".getBytes(StandardCharsets.UTF_8)
        );

        assertThatThrownBy(() -> ArchivoAdjuntoValidator.validarPdf(archivo))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("no es un PDF valido");
    }

    @Test
    void validarPdf_archivoPdfValido_noLanzaExcepcion() {

        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "remito.pdf", "application/pdf", CONTENIDO_PDF_VALIDO
        );

        assertThatCode(() -> ArchivoAdjuntoValidator.validarPdf(archivo))
                .doesNotThrowAnyException();
    }

    @Test
    void validarPdf_nombreConMayusculasEnLaExtension_esAceptado() {

        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "remito.PDF", "application/pdf", CONTENIDO_PDF_VALIDO
        );

        assertThatCode(() -> ArchivoAdjuntoValidator.validarPdf(archivo))
                .doesNotThrowAnyException();
    }

    @Test
    void sanitizarNombreOriginal_conIntentoDePathTraversal_devuelveSoloElNombreDeArchivo() {

        String resultado = ArchivoAdjuntoValidator.sanitizarNombreOriginal(
                "../../etc/passwd.pdf"
        );

        assertThat(resultado).isEqualTo("passwd.pdf");
    }

    @Test
    void sanitizarNombreOriginal_nombreRutaAbsolutaWindows_devuelveSoloElNombreDeArchivo() {

        String resultado = ArchivoAdjuntoValidator.sanitizarNombreOriginal(
                "C:\\Windows\\System32\\malicioso.pdf"
        );

        assertThat(resultado).doesNotContain("\\");
    }

    @Test
    void sanitizarNombreOriginal_nombreNulo_devuelveNombrePorDefecto() {

        String resultado = ArchivoAdjuntoValidator.sanitizarNombreOriginal(null);

        assertThat(resultado).isEqualTo("archivo.pdf");
    }

    @Test
    void resolverDestinoSeguro_nombreDentroDeLaCarpeta_devuelveElPathEsperado(
            @TempDir Path carpeta
    ) {

        Path destino = ArchivoAdjuntoValidator.resolverDestinoSeguro(
                carpeta, "abc-123.pdf"
        );

        assertThat(destino).isEqualTo(carpeta.resolve("abc-123.pdf"));
    }

    @Test
    void resolverDestinoSeguro_nombreQueIntentaEscaparDeLaCarpeta_lanzaBusinessException(
            @TempDir Path carpeta
    ) {

        assertThatThrownBy(() ->
                ArchivoAdjuntoValidator.resolverDestinoSeguro(
                        carpeta, "../fuera-de-la-carpeta.pdf"
                )
        ).isInstanceOf(BusinessException.class);
    }

    @Test
    void prepararParaGuardar_archivoVacio_lanzaBusinessException() {

        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "remito.pdf", "application/pdf", new byte[0]
        );

        assertThatThrownBy(() -> ArchivoAdjuntoValidator.prepararParaGuardar(archivo))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("adjuntar un archivo");
    }

    @Test
    void prepararParaGuardar_pdfValido_devuelveLosMismosBytes() {

        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "remito.pdf", "application/pdf", CONTENIDO_PDF_VALIDO
        );

        byte[] resultado = ArchivoAdjuntoValidator.prepararParaGuardar(archivo);

        assertThat(resultado).isEqualTo(CONTENIDO_PDF_VALIDO);
    }

    @Test
    void prepararParaGuardar_fotoJpegValida_seConvierteAPdf() throws Exception {

        byte[] jpeg = generarImagenDePrueba("jpg");

        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "remito.jpg", "image/jpeg", jpeg
        );

        byte[] resultado = ArchivoAdjuntoValidator.prepararParaGuardar(archivo);

        assertThat(new String(resultado, 0, 4, StandardCharsets.US_ASCII))
                .isEqualTo("%PDF");
    }

    @Test
    void prepararParaGuardar_fotoPngValida_seConvierteAPdf() throws Exception {

        byte[] png = generarImagenDePrueba("png");

        MockMultipartFile archivo = new MockMultipartFile(
                "archivo", "remito.png", "image/png", png
        );

        byte[] resultado = ArchivoAdjuntoValidator.prepararParaGuardar(archivo);

        assertThat(new String(resultado, 0, 4, StandardCharsets.US_ASCII))
                .isEqualTo("%PDF");
    }

    @Test
    void prepararParaGuardar_formatoNoSoportado_lanzaBusinessException() {

        MockMultipartFile archivo = new MockMultipartFile(
                "archivo",
                "remito.txt",
                "text/plain",
                "esto no es ni un pdf ni una foto".getBytes(StandardCharsets.UTF_8)
        );

        assertThatThrownBy(() -> ArchivoAdjuntoValidator.prepararParaGuardar(archivo))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Solo se permiten archivos PDF o fotos");
    }

    private byte[] generarImagenDePrueba(String formato) throws Exception {

        BufferedImage imagen =
                new BufferedImage(10, 10, BufferedImage.TYPE_INT_RGB);

        ByteArrayOutputStream salida = new ByteArrayOutputStream();

        ImageIO.write(imagen, formato, salida);

        return salida.toByteArray();
    }
}
