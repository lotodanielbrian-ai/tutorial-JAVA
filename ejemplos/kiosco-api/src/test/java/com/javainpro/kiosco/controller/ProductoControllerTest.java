package com.javainpro.kiosco.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.javainpro.kiosco.dto.ProductoRequest;
import com.javainpro.kiosco.dto.ProductoResponse;
import com.javainpro.kiosco.exception.ProductoDuplicadoException;
import com.javainpro.kiosco.exception.RecursoNoEncontradoException;
import com.javainpro.kiosco.service.ProductoService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProductoController.class)
class ProductoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductoService service;

    @Test
    void listarResponde200() throws Exception {
        when(service.listar()).thenReturn(List.of(new ProductoResponse(1L, "Alfajor", 1200.0, 1200.0, 30)));

        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Alfajor"));
    }

    @Test
    void obtenerInexistenteResponde404() throws Exception {
        when(service.obtener(99L)).thenThrow(new RecursoNoEncontradoException("Producto", 99L));

        mockMvc.perform(get("/api/productos/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensaje").value("Producto con id 99 no encontrado"));
    }

    @Test
    void crearResponde201() throws Exception {
        when(service.crear(any(ProductoRequest.class))).thenReturn(new ProductoResponse(5L, "Mate", 900.0, 900.0, 4));

        mockMvc.perform(post("/api/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Mate\",\"precio\":900,\"stock\":4}"))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/productos/5"))
                .andExpect(jsonPath("$.id").value(5));
    }

    @Test
    void crearSinNombreResponde400() throws Exception {
        mockMvc.perform(post("/api/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"\",\"precio\":900,\"stock\":4}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").value("El nombre es obligatorio"));
    }

    @Test
    void jsonRotoResponde400() throws Exception {
        mockMvc.perform(post("/api/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void verboInexistenteResponde405() throws Exception {
        mockMvc.perform(patch("/api/productos/1")).andExpect(status().isMethodNotAllowed());
    }

    @Test
    void idQueNoEsNumeroResponde400() throws Exception {
        mockMvc.perform(get("/api/productos/abc")).andExpect(status().isBadRequest());
    }

    @Test
    void cuerpoQueNoEsJsonResponde415() throws Exception {
        mockMvc.perform(post("/api/productos").contentType(MediaType.TEXT_PLAIN).content("hola"))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    void eliminarResponde204() throws Exception {
        mockMvc.perform(delete("/api/productos/1")).andExpect(status().isNoContent());
    }

    @Test
    void eliminarInexistenteResponde404() throws Exception {
        doThrow(new RecursoNoEncontradoException("Producto", 9L)).when(service).eliminar(9L);

        mockMvc.perform(delete("/api/productos/9")).andExpect(status().isNotFound());
    }

    @Test
    void actualizarConNombreDuplicadoResponde409() throws Exception {
        when(service.actualizar(any(Long.class), any(ProductoRequest.class)))
                .thenThrow(new ProductoDuplicadoException("Yerba"));

        mockMvc.perform(put("/api/productos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Yerba\",\"precio\":1200,\"stock\":5}"))
                .andExpect(status().isConflict());
    }

    @Test
    void conflictoDeIntegridadEnBaseResponde409() throws Exception {
        when(service.crear(any(ProductoRequest.class)))
                .thenThrow(new DataIntegrityViolationException("Unique index violation"));

        mockMvc.perform(post("/api/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nombre\":\"Mate\",\"precio\":900,\"stock\":4}"))
                .andExpect(status().isConflict());
    }
}
