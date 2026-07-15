package protecciones.controller;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import protecciones.dto.OrdenProvisionRequestDTO;
import protecciones.dto.OrdenProvisionResponseDTO;
import protecciones.service.OrdenProvisionService;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

@RestController
@RequestMapping("/api/ordenes-provision")
public class OrdenProvisionController {

    private final OrdenProvisionService
            ordenProvisionService;

    public OrdenProvisionController(
            OrdenProvisionService ordenProvisionService
    ) {

        this.ordenProvisionService =
                ordenProvisionService;
    }

    @GetMapping
    public List<OrdenProvisionResponseDTO>
    obtenerTodos() {

        return ordenProvisionService
                .obtenerTodos();
    }

    @PostMapping
    public ResponseEntity<
            OrdenProvisionResponseDTO
    >
    guardar(

            @Valid
            @RequestBody
            OrdenProvisionRequestDTO dto
    ) {

        OrdenProvisionResponseDTO response =
                ordenProvisionService
                        .guardar(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    public OrdenProvisionResponseDTO
    actualizar(

            @PathVariable Long id,

            @Valid
            @RequestBody
            OrdenProvisionRequestDTO dto
    ) {

        return ordenProvisionService
                .actualizar(
                        id,
                        dto
                );
    }

    @PostMapping(
                value = "/{id}/archivo",
                consumes =
                        MediaType.MULTIPART_FORM_DATA_VALUE
        )
        public ResponseEntity<Void>
        subirArchivo(

                @PathVariable Long id,

                @RequestPart(
                        "archivo"
                )
                MultipartFile archivo
        ) {

        ordenProvisionService
                .subirArchivo(
                        id,
                        archivo
                );

        return ResponseEntity
                .ok()
                .build();
        }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    eliminar(
            @PathVariable Long id
    ) {

        ordenProvisionService
                .eliminar(id);

        return ResponseEntity
                .noContent()
                .build();
    }

    @GetMapping("/{id}/archivo")
        public ResponseEntity<Resource>
        obtenerArchivo(

                @PathVariable Long id
        ) {

        Resource archivo =
                ordenProvisionService
                        .obtenerArchivo(
                                id
                        );

        return ResponseEntity
                .ok()
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(
                        archivo
                );
        }

        @GetMapping("/disponibles")
        public List<OrdenProvisionResponseDTO>
        obtenerDisponibles() {

        return ordenProvisionService
                .obtenerDisponibles();
        }

        @GetMapping("/paginado")
        public Page<OrdenProvisionResponseDTO>
        obtenerPaginados(

                @RequestParam(defaultValue = "0")
                int page,

                @RequestParam(defaultValue = "10")
                int size,

                @RequestParam(defaultValue = "id,desc")
                String sort,

                @RequestParam(defaultValue = "")
                String texto,

                @RequestParam(required = false)
                Boolean asociado
        ) {

        return ordenProvisionService
                .obtenerPaginados(
                        page,
                        size,
                        sort,
                        texto,
                        asociado
                );
        }
}