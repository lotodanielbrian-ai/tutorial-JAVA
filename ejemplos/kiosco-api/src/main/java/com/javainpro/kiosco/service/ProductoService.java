package com.javainpro.kiosco.service;

import com.javainpro.kiosco.dto.ProductoRequest;
import com.javainpro.kiosco.dto.ProductoResponse;
import java.util.List;

/** El contrato: qué se puede hacer. El cómo está en ProductoServiceImpl. */
public interface ProductoService {

    List<ProductoResponse> listar();

    ProductoResponse obtener(Long id);

    ProductoResponse crear(ProductoRequest request);

    ProductoResponse actualizar(Long id, ProductoRequest request);

    void eliminar(Long id);

    List<ProductoResponse> conPocoStock(Integer minimo);
}
