package com.javainpro.kiosco.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.javainpro.kiosco.dto.ProductoRequest;
import com.javainpro.kiosco.dto.ProductoResponse;
import com.javainpro.kiosco.exception.ProductoDuplicadoException;
import com.javainpro.kiosco.exception.RecursoNoEncontradoException;
import com.javainpro.kiosco.model.Producto;
import com.javainpro.kiosco.repository.ProductoRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductoServiceImplTest {

    @Mock
    private ProductoRepository repository;

    @InjectMocks
    private ProductoServiceImpl service;

    private Producto producto(Long id, String nombre, double precio) {
        Producto p = new Producto();
        p.setId(id);
        p.setNombre(nombre);
        p.setPrecio(precio);
        p.setStock(10);
        return p;
    }

    @Test
    @DisplayName("Un producto barato conserva su precio")
    void precioSinRecargo() {
        assertEquals(1200, service.calcularPrecioFinal(1200));
    }

    @Test
    @DisplayName("En el límite exacto no se cobra recargo")
    void precioEnElLimite() {
        assertEquals(5000, service.calcularPrecioFinal(5000));
    }

    @Test
    @DisplayName("Un producto caro lleva 15% de recargo")
    void precioConRecargo() {
        assertEquals(11500, service.calcularPrecioFinal(10000), 0.001);
    }

    @Test
    void listarDevuelveSoloLoQueDaElRepositorio() {
        when(repository.findByActivoTrue()).thenReturn(List.of(producto(1L, "Alfajor", 1200)));

        List<ProductoResponse> resultado = service.listar();

        assertEquals(1, resultado.size());
        assertEquals("Alfajor", resultado.get(0).nombre());
    }

    @Test
    void obtenerLanzaExcepcionSiNoExiste() {
        when(repository.findByIdAndActivoTrue(99L)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> service.obtener(99L));
    }

    @Test
    void crearGuardaElProducto() {
        ProductoRequest request = new ProductoRequest("Yerba", 4500.0, 3);
        when(repository.existsByNombre("Yerba")).thenReturn(false);
        when(repository.save(any(Producto.class))).thenReturn(producto(7L, "Yerba", 4500));

        ProductoResponse resultado = service.crear(request);

        assertEquals(7L, resultado.id());
        verify(repository).save(any(Producto.class));
    }

    @Test
    void crearRechazaUnNombreRepetido() {
        when(repository.existsByNombre("Yerba")).thenReturn(true);

        assertThrows(ProductoDuplicadoException.class, () -> service.crear(new ProductoRequest("Yerba", 4500.0, 3)));
        verify(repository, never()).save(any());
    }

    @Test
    void actualizarRechazaUnNombreRepetido() {
        when(repository.findByIdAndActivoTrue(1L)).thenReturn(Optional.of(producto(1L, "Alfajor", 1200)));
        when(repository.existsByNombre("Yerba")).thenReturn(true);

        assertThrows(ProductoDuplicadoException.class, () -> service.actualizar(1L, new ProductoRequest("Yerba", 1500.0, 5)));
        verify(repository, never()).save(any());
    }

    @Test
    void eliminarEsUnBorradoLogico() {
        Producto existente = producto(1L, "Alfajor", 1200);
        when(repository.findByIdAndActivoTrue(1L)).thenReturn(Optional.of(existente));

        service.eliminar(1L);

        assertFalse(existente.isActivo());
        verify(repository).save(existente);
    }
}
