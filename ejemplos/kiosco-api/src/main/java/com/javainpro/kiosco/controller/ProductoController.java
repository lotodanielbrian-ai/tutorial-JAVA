package com.javainpro.kiosco.controller;

import com.javainpro.kiosco.dto.ProductoRequest;
import com.javainpro.kiosco.dto.ProductoResponse;
import com.javainpro.kiosco.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
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
    @ApiResponse(responseCode = "200", description = "Lista de productos, vacía si no hay ninguno")
    public List<ProductoResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca un producto por id")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Producto encontrado"),
        @ApiResponse(responseCode = "404", description = "No hay un producto activo con ese id")
    })
    public ProductoResponse obtener(@Parameter(description = "Id del producto", example = "1") @PathVariable Long id) {
        return service.obtener(id);
    }

    @GetMapping("/poco-stock")
    @Operation(summary = "Lista los productos con stock menor al indicado")
    @ApiResponse(responseCode = "200", description = "Productos por debajo del mínimo")
    public List<ProductoResponse> conPocoStock(
            @Parameter(description = "Stock mínimo", example = "5") @RequestParam(defaultValue = "5") Integer minimo) {
        return service.conPocoStock(minimo);
    }

    @PostMapping
    @Operation(summary = "Crea un producto")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Producto creado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "409", description = "Ya existe un producto con ese nombre")
    })
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request) {
        ProductoResponse creado = service.crear(request);
        return ResponseEntity.created(URI.create("/api/productos/" + creado.id())).body(creado);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Reemplaza los datos de un producto")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Producto actualizado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "404", description = "No hay un producto activo con ese id")
    })
    public ProductoResponse actualizar(
            @Parameter(description = "Id del producto", example = "1") @PathVariable Long id,
            @Valid @RequestBody ProductoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Da de baja un producto")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Producto dado de baja"),
        @ApiResponse(responseCode = "404", description = "No hay un producto activo con ese id")
    })
    public ResponseEntity<Void> eliminar(@Parameter(description = "Id del producto", example = "1") @PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
