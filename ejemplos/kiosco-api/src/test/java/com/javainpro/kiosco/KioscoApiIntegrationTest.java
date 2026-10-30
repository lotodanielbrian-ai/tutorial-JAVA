package com.javainpro.kiosco;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

/** Levanta la aplicación completa con H2 y data.sql: prueba todas las capas juntas. */
@SpringBootTest
@AutoConfigureMockMvc
class KioscoApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void listaLosDatosInicialesYAplicaElRecargo() throws Exception {
        mockMvc.perform(get("/api/productos/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Termo"))
                .andExpect(jsonPath("$.precioFinal").value(20700.0));
    }

    @Test
    void laConsultaPropiaEncuentraElPocoStock() throws Exception {
        mockMvc.perform(get("/api/productos/poco-stock").param("minimo", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Yerba"));
    }
}
