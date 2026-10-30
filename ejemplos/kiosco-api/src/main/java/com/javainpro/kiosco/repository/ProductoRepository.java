package com.javainpro.kiosco.repository;

import com.javainpro.kiosco.model.Producto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByActivoTrue();

    Optional<Producto> findByIdAndActivoTrue(Long id);

    boolean existsByNombre(String nombre);

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.stock < :minimo ORDER BY p.stock")
    List<Producto> buscarConPocoStock(@Param("minimo") Integer minimo);
}
