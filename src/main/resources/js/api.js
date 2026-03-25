const API_BASE = 'http://localhost:8080/api';

// LIVROS
async function listarLivros() {
    const res = await fetch(`${API_BASE}/livros`);
    return res.json();
}
async function salvarLivro(livro) {
    const res = await fetch(`${API_BASE}/livros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(livro)
    });
    return res.json();
}
async function atualizarLivro(id, livro) {
    const res = await fetch(`${API_BASE}/livros/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(livro)
    });
    return res.json();
}
async function deletarLivro(id) {
    await fetch(`${API_BASE}/livros/${id}`, { method: 'DELETE' });
}

// CLIENTES
async function listarClientes() {
    const res = await fetch(`${API_BASE}/clientes`);
    return res.json();
}
async function salvarCliente(cliente) {
    const res = await fetch(`${API_BASE}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    });
    return res.json();
}
async function atualizarCliente(id, cliente) {
    const res = await fetch(`${API_BASE}/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    });
    return res.json();
}
async function deletarCliente(id) {
    await fetch(`${API_BASE}/clientes/${id}`, { method: 'DELETE' });
}

// VENDAS
async function listarVendas() {
    const res = await fetch(`${API_BASE}/vendas`);
    return res.json();
}
async function registrarVenda(venda) {
    const res = await fetch(`${API_BASE}/vendas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venda)
    });
    return res.json();
}
