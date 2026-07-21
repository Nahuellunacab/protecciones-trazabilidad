package protecciones.service.similarity;

import org.apache.commons.text.similarity.JaroWinklerSimilarity;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Set;

/**
 * Deteccion generica de registros similares por nombre, sin IA ni
 * servicios externos: normaliza los textos (NormalizadorTexto) y los
 * compara con Jaro-Winkler (Apache Commons Text), pensado para nombres
 * cortos de catalogo donde diferencias de prefijo/sufijo (siglas,
 * niveles de tension, "Norte"/"Sur", etc.) son mas relevantes que en
 * texto libre largo.
 *
 * No depende de ninguna entidad JPA: cada Service de dominio (Destino,
 * Posicion, Localidad, Marca, Modelo, Proveedor...) arma su propia
 * lista de CandidatoSimilitud y, si corresponde, su propio set de
 * palabras a ignorar en la normalizacion.
 */
@Service
public class SimilarityService {

    public static final int UMBRAL_SIMILITUD_DEFAULT = 80;

    private final JaroWinklerSimilarity jaroWinkler =
            new JaroWinklerSimilarity();

    public List<ResultadoSimilitud> buscarSimilares(
            String texto,
            List<CandidatoSimilitud> candidatos
    ) {

        return buscarSimilares(
                texto,
                candidatos,
                Set.of(),
                UMBRAL_SIMILITUD_DEFAULT
        );
    }

    public List<ResultadoSimilitud> buscarSimilares(
            String texto,
            List<CandidatoSimilitud> candidatos,
            Set<String> palabrasIgnoradas
    ) {

        return buscarSimilares(
                texto,
                candidatos,
                palabrasIgnoradas,
                UMBRAL_SIMILITUD_DEFAULT
        );
    }

    public List<ResultadoSimilitud> buscarSimilares(
            String texto,
            List<CandidatoSimilitud> candidatos,
            Set<String> palabrasIgnoradas,
            int umbralSimilitud
    ) {

        if (texto == null
                || texto.isBlank()
                || candidatos == null
                || candidatos.isEmpty()) {

            return List.of();
        }

        String textoNormalizado =
                NormalizadorTexto.normalizar(
                        texto,
                        palabrasIgnoradas
                );

        if (textoNormalizado.isBlank()) {

            return List.of();
        }

        return candidatos.stream()
                .map(candidato -> new ResultadoSimilitud(
                        candidato.getId(),
                        candidato.getNombre(),
                        calcularPorcentaje(
                                textoNormalizado,
                                NormalizadorTexto.normalizar(
                                        candidato.getNombre(),
                                        palabrasIgnoradas
                                )
                        )
                ))
                .filter(resultado -> resultado.getSimilitud() > umbralSimilitud)
                .sorted(
                        Comparator.comparingInt(ResultadoSimilitud::getSimilitud)
                                .reversed()
                )
                .toList();
    }

    private int calcularPorcentaje(
            String textoNormalizadoA,
            String textoNormalizadoB
    ) {

        if (textoNormalizadoA.isBlank()
                || textoNormalizadoB.isBlank()) {

            return 0;
        }

        double similitud =
                jaroWinkler.apply(
                        textoNormalizadoA,
                        textoNormalizadoB
                );

        return (int) Math.round(similitud * 100);
    }
}
