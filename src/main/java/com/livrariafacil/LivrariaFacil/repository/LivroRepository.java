package com.livrariafacil.repository;

import com.livrariafacil.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LivroRepository extends JpaRepository<Livro, Long> {
    List<Livro> findByTituloContainingIgnoreCase(String titulo);
    Optional<Livro> findByIsbn(String isbn);
    List<Livro> findByEstoqueGreaterThan(int estoque);
}
