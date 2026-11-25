package com.javainpro.kiosco.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Convierte cada excepción en una respuesta clara, sin repetir try-catch en los controladores.
 * Hereda de ResponseEntityExceptionHandler para que los errores propios de Spring conserven su
 * código (404, 405, 415, 400): sin eso, el handler de Exception los convertiría a todos en 500.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Object> noEncontrado(RecursoNoEncontradoException e) {
        log.warn(e.getMessage());
        return responder(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(ProductoDuplicadoException.class)
    public ResponseEntity<Object> duplicado(ProductoDuplicadoException e) {
        return responder(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> conflictoDeDatos(DataIntegrityViolationException e) {
        log.warn("Conflicto de integridad en base de datos: {}", e.getMostSpecificCause().getMessage());
        return responder(HttpStatus.CONFLICT, "Ya existe un registro con esos datos únicos");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> inesperado(Exception e) {
        log.error("Error inesperado", e);
        return responder(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error inesperado");
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException e,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String mensaje = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Datos inválidos");
        return responder(status, mensaje);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException e,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        return responder(status, "El JSON enviado no es válido");
    }

    /** Todos los demás errores de Spring pasan por acá y salen con el mismo formato. */
    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception e, Object body,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        return responder(status, mensajeDe(status));
    }

    private String mensajeDe(HttpStatusCode status) {
        return switch (status.value()) {
            case 404 -> "La ruta no existe";
            case 405 -> "Ese verbo no existe en esta ruta";
            case 415 -> "Enviá el cuerpo como JSON";
            default -> "El pedido no es válido";
        };
    }

    private ResponseEntity<Object> responder(HttpStatusCode estado, String mensaje) {
        return ResponseEntity.status(estado).body(ErrorResponse.de(estado.value(), mensaje));
    }
}
