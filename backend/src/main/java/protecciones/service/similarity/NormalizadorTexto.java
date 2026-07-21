package protecciones.service.similarity;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.Collections;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Normalizacion de texto compartida por SimilarityService antes de
 * comparar dos nombres: mayusculas, sin tildes, sin caracteres
 * especiales/puntos/guiones, sin niveles de tension (132KV, 66 KV,
 * etc.) y sin espacios redundantes.
 *
 * El set de "palabras ignoradas" (siglas o terminos propios de un
 * dominio, ej. "ET"/"ESTACION TRANSFORMADORA" para Destino/Posicion)
 * lo aporta cada llamador: este normalizador no conoce ninguna
 * entidad del sistema, solo texto.
 */
public final class NormalizadorTexto {

    private static final Pattern NIVEL_TENSION =
            Pattern.compile("\\b\\d+\\s*KV\\.?\\b");

    private static final Pattern CARACTERES_NO_ALFANUMERICOS =
            Pattern.compile("[^A-Z0-9\\s]");

    private static final Pattern ESPACIOS_MULTIPLES =
            Pattern.compile("\\s+");

    private static final Pattern MARCAS_DIACRITICAS =
            Pattern.compile("\\p{InCombiningDiacriticalMarks}+");

    private NormalizadorTexto() {
    }

    private static String quitarAcentos(String texto) {

        String descompuesto =
                Normalizer.normalize(
                        texto,
                        Normalizer.Form.NFD
                );

        return MARCAS_DIACRITICAS
                .matcher(descompuesto)
                .replaceAll("");
    }

    public static String normalizar(String texto) {

        return normalizar(
                texto,
                Collections.emptySet()
        );
    }

    public static String normalizar(
            String texto,
            Set<String> palabrasIgnoradas
    ) {

        if (texto == null) {

            return "";
        }

        String resultado =
                quitarAcentos(
                        texto.toUpperCase()
                );

        resultado = NIVEL_TENSION
                .matcher(resultado)
                .replaceAll(" ");

        resultado = CARACTERES_NO_ALFANUMERICOS
                .matcher(resultado)
                .replaceAll(" ");

        if (palabrasIgnoradas != null
                && !palabrasIgnoradas.isEmpty()) {

            resultado = Arrays.stream(
                            resultado.split(" ")
                    )
                    .filter(palabra -> !palabrasIgnoradas.contains(palabra))
                    .collect(Collectors.joining(" "));
        }

        resultado = ESPACIOS_MULTIPLES
                .matcher(resultado)
                .replaceAll(" ");

        return resultado.trim();
    }
}
