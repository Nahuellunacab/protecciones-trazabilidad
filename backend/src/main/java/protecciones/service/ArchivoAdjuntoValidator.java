package protecciones.service;

import org.springframework.web.multipart.MultipartFile;
import protecciones.exception.BusinessException;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Path;

// Validacion compartida por RemitoService y OrdenProvisionService para los
// PDF adjuntos: solo se acepta PDF (extension + Content-Type + firma binaria,
// asi un archivo malicioso no puede hacerse pasar por PDF con solo cambiar
// el nombre o el header) y el nombre en disco siempre se genera (UUID),
// nunca se deriva del nombre original, para no arrastrar path traversal
// (ej. "../../etc/passwd.pdf") hacia el filesystem.
final class ArchivoAdjuntoValidator {

    private static final byte[] FIRMA_PDF =
            new byte[] { '%', 'P', 'D', 'F' };

    private ArchivoAdjuntoValidator() {
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

        String limpio =
                Path.of(nombreOriginal)
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
