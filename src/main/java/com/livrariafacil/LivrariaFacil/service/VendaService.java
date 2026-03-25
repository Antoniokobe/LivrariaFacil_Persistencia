package com.livrariafacil.service;

import com.livrariafacil.model.ItemVenda;
import com.livrariafacil.model.Livro;
import com.livrariafacil.model.Venda;
import com.livrariafacil.repository.LivroRepository;
import com.livrariafacil.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private LivroRepository livroRepository;

    // Lista todas as vendas (histórico completo)
    public List<Venda> listarTodas() {
        return vendaRepository.findAll();
    }

    // Busca venda por ID
    public Optional<Venda> buscarPorId(Long id) {
        return vendaRepository.findById(id);
    }

    // Busca todas as vendas de um cliente específico
    public List<Venda> buscarPorCliente(Long clienteId) {
        return vendaRepository.findByClienteId(clienteId);
    }

    // Busca vendas dentro de um período de datas (filtro do histórico)
    public List<Venda> buscarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return vendaRepository.findByDataVendaBetween(inicio, fim);
    }

    // Finaliza a venda: valida estoque, desconta, calcula total e persiste
    @Transactional
    public Venda finalizarVenda(Venda venda) {

        if (venda.getCliente() == null || venda.getCliente().getId() == null) {
            throw new RuntimeException("Cliente não informado para a venda.");
        }

        if (venda.getItens() == null || venda.getItens().isEmpty()) {
            throw new RuntimeException("A venda deve conter pelo menos um item.");
        }

        BigDecimal total = BigDecimal.ZERO;

        for (ItemVenda item : venda.getItens()) {

            if (item.getLivro() == null || item.getLivro().getId() == null) {
                throw new RuntimeException("Item da venda com livro não informado.");
            }

            if (item.getQuantidade() == null || item.getQuantidade() < 1) {
                throw new RuntimeException("Quantidade do item deve ser maior que zero.");
            }

            // Busca o livro no banco para garantir dados atualizados
            Livro livro = livroRepository.findById(item.getLivro().getId())
                .orElseThrow(() -> new RuntimeException(
                    "Livro não encontrado: ID " + item.getLivro().getId()));

            // Verifica estoque suficiente
            if (livro.getEstoque() < item.getQuantidade()) {
                throw new RuntimeException(
                    "Estoque insuficiente para o livro \"" + livro.getTitulo() +
                    "\". Disponível: " + livro.getEstoque() +
                    " | Solicitado: " + item.getQuantidade());
            }

            // Desconta estoque
            livro.setEstoque(livro.getEstoque() - item.getQuantidade());
            livroRepository.save(livro);

            // Registra preço unitário atual do livro no item
            item.setPrecoUnitario(livro.getPrecoVenda());

            // Calcula subtotal do item
            BigDecimal subtotal = livro.getPrecoVenda()
                .multiply(BigDecimal.valueOf(item.getQuantidade()));
            item.setSubtotal(subtotal);

            // Vincula o item à venda
            item.setVenda(venda);

            // Acumula no total geral
            total = total.add(subtotal);
        }

        // Define total e data da venda
        venda.setTotal(total);
        venda.setDataVenda(LocalDateTime.now());

        // Persiste a venda com todos os itens (CascadeType.ALL cuida dos itens)
        return vendaRepository.save(venda);
    }

    // Exclui uma venda (uso administrativo)
    public void deletar(Long id) {
        if (vendaRepository.findById(id).isEmpty()) {
            throw new RuntimeException("Venda não encontrada: ID " + id);
        }
        vendaRepository.deleteById(id);
    }
}

