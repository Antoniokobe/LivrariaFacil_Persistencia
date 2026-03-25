package com.livrariafacil.service;

import com.livrariafacil.model.Livro;
import com.livrariafacil.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LivroService {

    @Autowired
    private LivroRepository repository;

    public List<Livro> listarTodos() {
        return repository.findAll();
    }

    public Optional<Livro> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Livro salvar(Livro livro) {
        return repository.save(livro);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public List<Livro> buscarPorTitulo(String titulo) {
        return repository.findByTituloContainingIgnoreCase(titulo);
    }

    public boolean diminuirEstoque(Long id, int quantidade) {
        Optional<Livro> opt = repository.findById(id);
        if (opt.isPresent()) {
            Livro livro = opt.get();
            if (livro.getEstoque() >= quantidade) {
                livro.setEstoque(livro.getEstoque() - quantidade);
                repository.save(livro);
                return true;
            }
        }
        return false;
    }
}
