package com.javainpro.kiosco.service;

import com.javainpro.kiosco.dto.ProductoRequest;
import com.javainpro.kiosco.dto.ProductoResponse;
import com.javainpro.kiosco.exception.ProductoDuplicadoException;
import com.javainpro.kiosco.exception.RecursoNoEncontradoException;
import com.javainpro.kiosco.model.Producto;
import com.javainpro.kiosco.repository.ProductoRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    static final double UMBRAL_RECARGO = 5000;
    static final double RECARGO = 1.15;

    private final ProductoRepository repository;

    @Override
    public List<ProductoResponse> listar() {
        return repository.findByActivoTrue().stream().map(this::aRespuesta).toList();
    }

    @Override
    public ProductoResponse obtener(Long id) {
        return aRespuesta(buscarActivo(id));
    }

    @Override
    public ProductoResponse crear(ProductoRequest request) {
        if (repository.existsByNombre(request.nombre())) {
            log.warn("Producto duplicado: {}", request.nombre());
            throw new ProductoDuplicadoException(request.nombre());
        }
        Producto producto = new Producto();
        copiarDatos(request, producto);
        Producto guardado = repository.save(producto);
        log.info("Producto creado con id {}", guardado.getId());
        return aRespuesta(guardado);
    }

    @Override
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = buscarActivo(id);
        if (!producto.getNombre().equals(request.nombre()) && repository.existsByNombre(request.nombre())) {
            log.warn("Producto duplicado al actualizar id {}: {}", id, request.nombre());
            throw new ProductoDuplicadoException(request.nombre());
        }
        copiarDatos(request, producto);
        return aRespuesta(repository.save(producto));
    }

    @Override
    public void eliminar(Long id) {
        Producto producto = buscarActivo(id);
        producto.setActivo(false);
        repository.save(producto);
    }

    @Override
    public List<ProductoResponse> conPocoStock(Integer minimo) {
        return repository.buscarConPocoStock(minimo).stream().map(this::aRespuesta).toList();
    }

    private Producto buscarActivo(Long id) {
        return repository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto", id));
    }

    private void copiarDatos(ProductoRequest request, Producto producto) {
        producto.setNombre(request.nombre());
        producto.setPrecio(request.precio());
        producto.setStock(request.stock());
    }

    /** Regla de negocio: los productos caros llevan un recargo del 15%. */
    double calcularPrecioFinal(double precio) {
        return precio > UMBRAL_RECARGO ? precio * RECARGO : precio;
    }

    private ProductoResponse aRespuesta(Producto p) {
        return new ProductoResponse(p.getId(), p.getNombre(), p.getPrecio(), calcularPrecioFinal(p.getPrecio()), p.getStock());
    }
}
