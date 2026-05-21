package protecciones.exception;

import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.ExceptionHandler;

import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
            BusinessException.class
    )
    public ResponseEntity<Map<String, String>>
    handleBusinessException(
            BusinessException ex
    ) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        Map.of(
                                "message",
                                ex.getMessage()
                        )
                );
    }

    @ExceptionHandler(
            DataIntegrityViolationException.class
    )
    public ResponseEntity<Map<String, String>>
    handleIntegrityException() {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        Map.of(
                                "message",
                                "No se puede eliminar porque la marca está siendo utilizada"
                        )
                );
    }
}