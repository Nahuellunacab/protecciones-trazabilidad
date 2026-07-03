package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.entity.Rele;

import java.time.LocalDateTime;

@Service
public class ReleBajaService {

    public void aplicarBaja(
            Rele rele,
            String motivo
    ) {

        rele.setActivo(false);

        rele.setFechaBaja(
                LocalDateTime.now()
        );

        rele.setMotivoBaja(
                motivo != null
                        ? motivo.trim()
                        : null
        );
    }
}
