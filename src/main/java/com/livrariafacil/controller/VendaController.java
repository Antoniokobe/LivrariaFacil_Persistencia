package com.livrariafacil.controller;

import com.livrariafacil.model.Venda;
import com.livrariafacil.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    @GetMapping
    public List<Venda> listarTodas() {
        return vendaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venda> buscarPorId(@PathVariable Long id) {
        Optional<Venda> venda = vendaService.buscarPorId(id);
        return venda.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Venda> buscarPorCliente(@PathVariable Long clienteId) {
        return vendaService.buscarPorCliente(clienteId);
    }

    @GetMapping("/periodo")
    public List<Venda> buscarPorPeriodo(
            @RequestParam("inicio") String inicio,
            @RequestParam("fim") String fim) {
        LocalDateTime dataInicio = LocalDateTime.parse(inicio);
        LocalDateTime dataFim = LocalDateTime.parse(fim);
        return vendaService.buscarPorPeriodo(dataInicio, dataFim);
    }

    @PostMapping
    public ResponseEntity<Venda> finalizarVenda(@RequestBody Venda venda) {
        Venda salva = vendaService.finalizarVenda(venda);
        return new ResponseEntity<>(salva, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Optional<Venda> existe = vendaService.buscarPorId(id);
        if (existe.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        vendaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
