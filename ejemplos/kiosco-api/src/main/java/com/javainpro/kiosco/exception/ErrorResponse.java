package com.javainpro.kiosco.exception;

import java.time.LocalDateTime;

/** Formato único de error: el cliente siempre recibe la misma estructura. */
public record ErrorResponse(LocalDateTime fecha, int estado, String mensaje) {

    public static ErrorResponse de(int estado, String mensaje) {
        return new ErrorResponse(LocalDateTime.now(), estado, mensaje);
    }
}
