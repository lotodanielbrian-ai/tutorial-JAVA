package com.javainpro.kiosco.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Va en su propia clase y no en la principal: @WebMvcTest carga la clase principal
 * sin JPA, y con esta anotación allí los tests del controlador no arrancan.
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
