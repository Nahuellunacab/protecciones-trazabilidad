package protecciones.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

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
