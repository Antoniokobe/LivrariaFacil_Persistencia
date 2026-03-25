package com.livrariafacil.repository;

import com.livrariafacil.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Long> {
    List<Venda> findByClienteId(Long clienteId);
    List<Venda> findByDataVendaBetween(LocalDateTime inicio, LocalDateTime fim);
}

