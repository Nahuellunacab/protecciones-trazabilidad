package protecciones.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.pdf.PdfWriter;

import org.springframework.web.multipart.MultipartFile;
import protecciones.exception.BusinessException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Path;

// Validacion compartida por RemitoService y OrdenProvisionService para los
// archivos adjuntos: se acepta PDF (extension + Content-Type + firma
// binaria, asi un archivo malicioso no puede hacerse pasar por PDF con solo
// cambiar el nombre o el header) o una foto (JPEG/PNG/WebP, detectada por
// firma binaria), que se convierte a un PDF de una pagina antes de
// guardarse: el invariante "los adjuntos siempre son PDF" (storage,
// Content-Type de descarga) no cambia. El nombre en disco siempre se genera
// (UUID), nunca se deriva del nombre original, para no arrastrar path
// traversal (ej. "../../etc/passwd.pdf") hacia el filesystem.
final class ArchivoAdjuntoValidator {

    private static final byte[] FIRMA_PDF =
            new byte[] { '%', 'P', 'D', 'F' };

    private static final byte[] FIRMA_JPEG =
            new byte[] { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF };

    private static final byte[] FIRMA_PNG =
            new byte[] {
                    (byte) 0x89, 'P', 'N', 'G', '\r', '\n', 0x1A, '\n'
            };

    private ArchivoAdjuntoValidator() {
    }

    // Punto de entrada usado por RemitoService/OrdenProvisionService: acepta
    // PDF (se valida y se devuelve tal cual) o una foto JPEG/PNG/WebP (se
    // convierte a PDF de una pagina). Devuelve siempre bytes de un PDF
    // valido, listos para escribirse a disco con extension ".pdf".
    static byte[] prepararParaGuardar(MultipartFile archivo) {

        if (archivo == null || archivo.isEmpty()) {

            throw new BusinessException(
                    "Debe adjuntar un archivo"
            );
        }

        byte[] contenido =
                leerBytes(archivo);

        if (tieneFirma(contenido, FIRMA_PDF)) {

            validarPdf(archivo);

            return contenido;
        }

        if (esImagenSoportada(contenido)) {

            return convertirImagenAPdf(contenido);
        }

        throw new BusinessException(
                "Solo se permiten archivos PDF o fotos (JPG, PNG o WebP)"
        );
    }

    private static boolean esImagenSoportada(byte[] contenido) {

        return tieneFirma(contenido, FIRMA_JPEG)
                || tieneFirma(contenido, FIRMA_PNG)
                || esWebp(contenido);
    }

    private static boolean esWebp(byte[] contenido) {

        return contenido.length >= 12
                && contenido[0] == 'R'
                && contenido[1] == 'I'
                && contenido[2] == 'F'
                && contenido[3] == 'F'
                && contenido[8] == 'W'
                && contenido[9] == 'E'
                && contenido[10] == 'B'
                && contenido[11] == 'P';
    }

    private static boolean tieneFirma(byte[] contenido, byte[] firma) {

        if (contenido.length < firma.length) {

            return false;
        }

        for (int i = 0; i < firma.length; i++) {

            if (contenido[i] != firma[i]) {

                return false;
            }
        }

        return true;
    }

    private static byte[] leerBytes(MultipartFile archivo) {

        try {

            return archivo.getBytes();

        } catch (IOException ex) {

            throw new UncheckedIOException(
                    "Error al leer el archivo",
                    ex
            );
        }
    }

    private static byte[] convertirImagenAPdf(byte[] imagen) {

        Document documento =
                new Document(PageSize.A4, 20, 20, 20, 20);

        try (
                ByteArrayOutputStream salida =
                        new ByteArrayOutputStream()
        ) {

            PdfWriter.getInstance(documento, salida);

            documento.open();

            Image imagenPdf =
                    Image.getInstance(imagen);

            imagenPdf.scaleToFit(
                    documento.getPageSize().getWidth() - 40,
                    documento.getPageSize().getHeight() - 40
            );

            imagenPdf.setAlignment(Image.ALIGN_CENTER);

            documento.add(imagenPdf);

            documento.close();

            return salida.toByteArray();

        } catch (DocumentException | IOException ex) {

            throw new BusinessException(
                    "No se pudo convertir la foto a PDF"
            );
        }
    }

    static void validarPdf(MultipartFile archivo) {

        if (archivo == null || archivo.isEmpty()) {

            throw new BusinessException(
                    "Debe adjuntar un archivo"
            );
        }

        String nombreOriginal =
                sanitizarNombreOriginal(
                        archivo.getOriginalFilename()
                );

        if (!nombreOriginal.toLowerCase().endsWith(".pdf")) {

            throw new BusinessException(
                    "Solo se permiten archivos PDF"
            );
        }

        if (!"application/pdf".equalsIgnoreCase(archivo.getContentType())) {

            throw new BusinessException(
                    "Solo se permiten archivos PDF"
            );
        }

        byte[] firma = new byte[FIRMA_PDF.length];

        try (var entrada = archivo.getInputStream()) {

            int leidos = entrada.readNBytes(firma, 0, firma.length);

            if (leidos < firma.length
                    || !java.util.Arrays.equals(firma, FIRMA_PDF)) {

                throw new BusinessException(
                        "El archivo no es un PDF valido"
                );
            }

        } catch (IOException ex) {

            throw new UncheckedIOException(
                    "Error al leer el archivo",
                    ex
            );
        }
    }

    // Nombre para mostrar en pantalla: solo el nombre de archivo (sin
    // componentes de ruta) del original, nunca usado para construir la
    // ruta real en disco.
    static String sanitizarNombreOriginal(String nombreOriginal) {

        if (nombreOriginal == null) {

            return "archivo.pdf";
        }

        // Normalizamos "\" a "/" antes de extraer el nombre: Path.of() solo
        // reconoce "\" como separador de directorio en Windows, así que sin
        // esto una ruta estilo Windows (ej. "C:\Windows\System32\x.pdf") no
        // se recortaba al correr en Linux (como en el contenedor de Docker).
        String limpio =
                Path.of(nombreOriginal.replace('\\', '/'))
                        .getFileName()
                        .toString();

        return limpio.isBlank() ? "archivo.pdf" : limpio;
    }

    // Resuelve el destino dentro de "carpeta" y verifica que el resultado
    // siga estando dentro de esa carpeta (defensa en profundidad, aunque el
    // nombre ya es un UUID generado por el propio backend).
    static Path resolverDestinoSeguro(
            Path carpeta,
            String nombreArchivo
    ) {

        Path destino =
                carpeta.resolve(nombreArchivo)
                        .normalize();

        if (!destino.startsWith(carpeta)) {

            throw new BusinessException(
                    "Nombre de archivo invalido"
            );
        }

        return destino;
    }
}
