package com.javainpro.kiosco.controller;

import com.javainpro.kiosco.dto.ProductoRequest;
import com.javainpro.kiosco.dto.ProductoResponse;
import com.javainpro.kiosco.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@Tag(name = "Productos", description = "Gestión de los productos del kiosco")
public class ProductoController {

    private final ProductoService service;

    @GetMapping
    @Operation(summary = "Lista los productos activos")
    public List<ProductoResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca un producto por id")
    public ProductoResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @GetMapping("/poco-stock")
    @Operation(summary = "Lista los productos con stock menor al indicado")
    public List<ProductoResponse> conPocoStock(@RequestParam(defaultValue = "5") Integer minimo) {
        return service.conPocoStock(minimo);
    }

    @PostMapping
    @Operation(summary = "Crea un producto")
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Reemplaza los datos de un producto")
    public ProductoResponse actualizar(@PathVariable Long id, @Valid @RequestBody ProductoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Da de baja un producto")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
