package protecciones.service;

import org.springframework.stereotype.Service;
import protecciones.entity.Movimiento;
import protecciones.repository.MovimientoRepository;

import java.util.List;

@Service
public class MovimientoService {

    private final MovimientoRepository movimientoRepository;

    public MovimientoService(MovimientoRepository movimientoRepository) {
        this.movimientoRepository = movimientoRepository;
    }

    public List<Movimiento> obtenerTodos() {
        return movimientoRepository.findAll();
    }

    public Movimiento guardar(Movimiento movimiento) {
        return movimientoRepository.save(movimiento);
    }
}