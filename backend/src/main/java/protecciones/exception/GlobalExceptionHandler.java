package protecciones.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(
            BusinessException.class
    )
    public ResponseEntity<ErrorResponse>
    handleBusinessException(
            BusinessException ex
    ) {

        return buildResponse(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(
            DataIntegrityViolationException.class
    )
    public ResponseEntity<ErrorResponse>
    handleIntegrityException() {

        return buildResponse(
                "No se puede completar la operacion porque el registro esta siendo utilizado",
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(
            NoSuchElementException.class
    )
    public ResponseEntity<ErrorResponse>
    handleNotFoundException() {

        return buildResponse(
                "Recurso no encontrado",
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<ErrorResponse>
    handleValidationException(
            MethodArgumentNotValidException ex
    ) {

        String message =
                ex.getBindingResult()
                        .getFieldErrors()
                        .stream()
                        .map(error ->
                                error.getField()
                                        + ": "
                                        + error.getDefaultMessage()
                        )
                        .collect(Collectors.joining("; "));

        return buildResponse(
                message,
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(
            HttpMessageNotReadableException.class
    )
    public ResponseEntity<ErrorResponse>
    handleMalformedJsonException() {

        return buildResponse(
                "El cuerpo de la solicitud no tiene un formato valido",
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(
            TooManyRequestsException.class
    )
    public ResponseEntity<ErrorResponse>
    handleTooManyRequestsException(
            TooManyRequestsException ex
    ) {

        return buildResponse(
                ex.getMessage(),
                HttpStatus.TOO_MANY_REQUESTS
        );
    }

    @ExceptionHandler(
            ResponseStatusException.class
    )
    public ResponseEntity<ErrorResponse>
    handleResponseStatusException(
            ResponseStatusException ex
    ) {

        return buildResponse(
                ex.getReason(),
                HttpStatus.valueOf(ex.getStatusCode().value())
        );
    }

    // Catch-all: cualquier excepcion no prevista (NPE, error de un servicio
    // externo, etc.) no debe filtrar detalles internos (stacktrace, mensaje
    // de la excepcion original) en la respuesta HTTP. Se loguea completa del
    // lado del servidor para poder diagnosticarla, pero al cliente solo se
    // le devuelve un mensaje generico.
    @ExceptionHandler(
            Exception.class
    )
    public ResponseEntity<ErrorResponse>
    handleUnexpectedException(
            Exception ex
    ) {

        log.error(
                "Error no controlado",
                ex
        );

        return buildResponse(
                "Ocurrio un error inesperado. Intente nuevamente mas tarde.",
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    private ResponseEntity<ErrorResponse>
    buildResponse(
            String message,
            HttpStatus status
    ) {

        return ResponseEntity
                .status(status)
                .body(new ErrorResponse(
                        message,
                        status.value()
                ));
    }
}
