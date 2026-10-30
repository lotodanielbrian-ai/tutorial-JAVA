package com.javainpro.kiosco.dto;

/** Lo que la API devuelve: incluye el precio final calculado. */
public record ProductoResponse(Long id, String nombre, Double precio, Double precioFinal, Integer stock) {
}
