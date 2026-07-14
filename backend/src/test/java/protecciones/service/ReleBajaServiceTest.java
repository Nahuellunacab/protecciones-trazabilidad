package protecciones.service;

import org.junit.jupiter.api.Test;
import protecciones.entity.Rele;

import static org.assertj.core.api.Assertions.assertThat;

class ReleBajaServiceTest {

    private final ReleBajaService releBajaService = new ReleBajaService();

    @Test
    void aplicarBaja_marcaElReleComoInactivoYRegistraFechaYMotivo() {

        Rele rele = new Rele();
        rele.setActivo(true);

        releBajaService.aplicarBaja(rele, "  Falla irreparable  ");

        assertThat(rele.getActivo()).isFalse();
        assertThat(rele.getFechaBaja()).isNotNull();
        assertThat(rele.getMotivoBaja()).isEqualTo("Falla irreparable");
    }

    @Test
    void aplicarBaja_conMotivoNulo_dejaMotivoBajaEnNull() {

        Rele rele = new Rele();
        rele.setActivo(true);

        releBajaService.aplicarBaja(rele, null);

        assertThat(rele.getActivo()).isFalse();
        assertThat(rele.getMotivoBaja()).isNull();
    }
}
