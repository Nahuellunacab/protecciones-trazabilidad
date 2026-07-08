package protecciones.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import protecciones.dto.CopilotoConsultaRequestDTO;
import protecciones.dto.CopilotoConsultaResponseDTO;

import protecciones.service.CopilotoIAService;

@RestController
@RequestMapping("/api/copiloto")
public class CopilotoController {

    private final CopilotoIAService
            copilotoIAService;

    public CopilotoController(
            CopilotoIAService copilotoIAService
    ) {

        this.copilotoIAService =
                copilotoIAService;
    }

    @PostMapping("/consultar")
    public CopilotoConsultaResponseDTO
    consultar(

            @Valid
            @RequestBody
            CopilotoConsultaRequestDTO dto
    ) {

        return copilotoIAService
                .consultar(dto);
    }
}
