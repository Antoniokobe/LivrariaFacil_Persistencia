package com.livrariafacil.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "livros")
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "ISBN é obrigatório.")
    @Column(nullable = false, unique = true, length = 20)
    private String isbn;

    @NotBlank(message = "Título é obrigatório.")
    @Column(nullable = false, length = 200)
    private String titulo;

    @NotBlank(message = "Autor é obrigatório.")
    @Column(nullable = false, length = 150)
    private String autor;

    @Column(length = 100)
    private String categoria;

    @NotNull(message = "Preço de custo é obrigatório.")
    @DecimalMin(value = "0.01", message = "Preço de custo deve ser maior que zero.")
    @Column(name = "precocusto", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoCusto;

    @NotNull(message = "Preço de venda é obrigatório.")
    @DecimalMin(value = "0.01", message = "Preço de venda deve ser maior que zero.")
    @Column(name = "precovenda", nullable = false, precision = 10, scale = 2)
    private BigDecimal precoVenda;

    @Min(value = 0, message = "Estoque não pode ser negativo.")
    @Column(nullable = false)
    private Integer estoque = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public BigDecimal getPrecoCusto() { return precoCusto; }
    public void setPrecoCusto(BigDecimal precoCusto) { this.precoCusto = precoCusto; }

    public BigDecimal getPrecoVenda() { return precoVenda; }
    public void setPrecoVenda(BigDecimal precoVenda) { this.precoVenda = precoVenda; }

    public Integer getEstoque() { return estoque; }
    public void setEstoque(Integer estoque) { this.estoque = estoque; }
}
