// ========================================
// validacoes.js - Livraria Fácil
// Validações e funcionalidades dinâmicas com integração API REST
// ========================================

const API_BASE_URL = '/api';

// ---------- UTILITÁRIOS ----------

function mostrarErro(inputId, mensagem) {
    const input = document.getElementById(inputId);
    const erro = document.getElementById('erro-' + inputId);
    if (input) input.classList.add('erro');
    if (erro) {
        erro.textContent = mensagem;
        erro.classList.add('visivel');
    }
}

function limparErro(inputId) {
    const input = document.getElementById(inputId);
    const erro = document.getElementById('erro-' + inputId);
    if (input) input.classList.remove('erro');
    if (erro) erro.classList.remove('visivel');
}

function mostrarAlerta(elementoId, tipo, mensagem) {
    const alerta = document.getElementById(elementoId);
    if (!alerta) return;
    alerta.className = 'alerta alerta-' + tipo + ' visivel';
    alerta.textContent = mensagem;
    setTimeout(() => alerta.classList.remove('visivel'), 4000);
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[\\D]/g, '');
    if (cpf.length !== 11 || /^(\\d)\\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let d1 = (soma * 10) % 11;
    if (d1 === 10 || d1 === 11) d1 = 0;
    if (d1 !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    let d2 = (soma * 10) % 11;
    if (d2 === 10 || d2 === 11) d2 = 0;
    return d2 === parseInt(cpf[10]);
}

function mascaraCPF(input) {
    let v = input.value.replace(/\\D/g, '');
    v = v.replace(/(\\d{3})(\\d)/, '$1.$2');
    v = v.replace(/(\\d{3})(\\d)/, '$1.$2');
    v = v.replace(/(\\d{3})(\\d{1,2})$/, '$1-$2');
    input.value = v;
}

function mascaraTelefone(input) {
    let v = input.value.replace(/\\D/g, '');
    if (v.length <= 10) {
        v = v.replace(/(\\d{2})(\\d)/, '($1) $2');
        v = v.replace(/(\\d{4})(\\d)/, '$1-$2');
    } else {
        v = v.replace(/(\\d{2})(\\d)/, '($1) $2');
        v = v.replace(/(\\d{5})(\\d)/, '$1-$2');
    }
    input.value = v;
}

// ---------- INÍCIO ----------

document.addEventListener('DOMContentLoaded', function () {

    // ==============================
    // PÁGINA: LIVROS
    // ==============================
    const formLivro = document.getElementById('formLivro');
    if (formLivro) {
        const btnLimparLivro = document.getElementById('btnLimparLivro');

        // Carrega livros do banco ao iniciar
        function carregarLivrosTabela() {
            fetch(`${API_BASE_URL}/livros`)
                .then(response => response.json())
                .then(livros => {
                    const tbody = document.querySelector('#tabelaLivros tbody');
                    tbody.innerHTML = '';
                    if (livros.length === 0) {
                        tbody.innerHTML = '<tr class="tabela-vazia"><td colspan="6">Nenhum livro cadastrado.</td></tr>';
                        return;
                    }
                    livros.forEach(livro => {
                        const linha = document.createElement('tr');
                        linha.innerHTML = `
                            <td>${livro.isbn}</td>
                            <td>${livro.titulo}</td>
                            <td>${livro.autor}</td>
                            <td>${livro.categoria || ''}</td>
                            <td>${formatarMoeda(livro.precoVenda)}</td>
                            <td>${livro.estoque}</td>
                        `;
                        tbody.appendChild(linha);
                    });
                })
                .catch(error => {
                    console.error('Erro ao carregar livros:', error);
                    mostrarAlerta('alertaLivro', 'erro', 'Erro ao carregar livros do banco de dados.');
                });
        }

        carregarLivrosTabela();

        formLivro.addEventListener('submit', function (e) {
            e.preventDefault();
            const campos = ['isbn', 'titulo', 'autor', 'precoCusto', 'precoVenda', 'estoque'];
            campos.forEach(id => limparErro(id));

            const isbn = document.getElementById('isbn').value.trim();
            const titulo = document.getElementById('titulo').value.trim();
            const autor = document.getElementById('autor').value.trim();
            const categoria = document.getElementById('categoria').value.trim();
            const precoCusto = parseFloat(document.getElementById('precoCusto').value);
            const precoVenda = parseFloat(document.getElementById('precoVenda').value);
            const estoque = parseInt(document.getElementById('estoque').value);

            let valido = true;
            if (!isbn) { mostrarErro('isbn', 'ISBN é obrigatório.'); valido = false; }
            if (!titulo) { mostrarErro('titulo', 'Título é obrigatório.'); valido = false; }
            if (!autor) { mostrarErro('autor', 'Autor é obrigatório.'); valido = false; }
            if (isNaN(precoCusto) || precoCusto <= 0) {
                mostrarErro('precoCusto', 'Preço de custo deve ser maior que zero.'); valido = false;
            }
            if (isNaN(precoVenda) || precoVenda <= 0) {
                mostrarErro('precoVenda', 'Preço de venda deve ser maior que zero.'); valido = false;
            }
            if (isNaN(estoque) || estoque < 0) {
                mostrarErro('estoque', 'Estoque não pode ser negativo.'); valido = false;
            }

            if (!valido) return;

            const livro = { isbn, titulo, autor, categoria, precoCusto, precoVenda, estoque };

            fetch(`${API_BASE_URL}/livros`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(livro)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            })
            .then(data => {
                mostrarAlerta('alertaLivro', 'sucesso', 'Livro cadastrado com sucesso!');
                formLivro.reset();
                carregarLivrosTabela();
            })
            .catch(error => {
                console.error('Erro ao cadastrar livro:', error);
                mostrarAlerta('alertaLivro', 'erro', 'Erro ao cadastrar livro: ' + (error.message || 'Erro desconhecido'));
            });
        });

        if (btnLimparLivro) {
            btnLimparLivro.addEventListener('click', function () {
                formLivro.reset();
                ['isbn', 'titulo', 'autor', 'precoCusto', 'precoVenda', 'estoque'].forEach(id => limparErro(id));
            });
        }
    }

    // ==============================
    // PÁGINA: CLIENTES
    // ==============================
    const formCliente = document.getElementById('formCliente');
    if (formCliente) {
        const btnLimparCliente = document.getElementById('btnLimparCliente');
        const msgCliente = document.getElementById('msgCliente');
        const cpfInput = document.getElementById('cpfCliente');
        const telefoneInput = document.getElementById('telefoneCliente');

        if (cpfInput) cpfInput.addEventListener('input', () => mascaraCPF(cpfInput));
        if (telefoneInput) telefoneInput.addEventListener('input', () => mascaraTelefone(telefoneInput));

        // Carrega clientes do banco ao iniciar
        function carregarClientesTabela() {
            fetch(`${API_BASE_URL}/clientes`)
                .then(response => response.json())
                .then(clientes => {
                    const tbody = document.querySelector('#tabelaClientes tbody');
                    tbody.innerHTML = '';
                    if (clientes.length === 0) {
                        tbody.innerHTML = '<tr class="tabela-vazia"><td colspan="5">Nenhum cliente cadastrado.</td></tr>';
                        return;
                    }
                    clientes.forEach(cliente => {
                        const linha = document.createElement('tr');
                        linha.innerHTML = `
                            <td>${cliente.nomeCompleto}</td>
                            <td>${cliente.cpf}</td>
                            <td>${cliente.email || ''}</td>
                            <td>${cliente.telefone || ''}</td>
                            <td><button class="btn btn-secundario btn-sm">Editar</button></td>
                        `;
                        tbody.appendChild(linha);
                    });
                })
                .catch(error => {
                    console.error('Erro ao carregar clientes:', error);
                });
        }

        carregarClientesTabela();

        formCliente.addEventListener('submit', function (e) {
            e.preventDefault();
            const nome = document.getElementById('nomeCliente').value.trim();
            const cpf = document.getElementById('cpfCliente').value.trim();
            const email = document.getElementById('emailCliente').value.trim();
            const telefone = document.getElementById('telefoneCliente').value.trim();

            let erros = [];
            if (!nome) erros.push('Nome completo é obrigatório.');
            if (!cpf) {
                erros.push('CPF é obrigatório.');
            } else if (!validarCPF(cpf)) {
                erros.push('CPF inválido.');
            }
            if (email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
                erros.push('E-mail inválido.');
            }

            if (erros.length > 0) {
                msgCliente.textContent = erros.join(' ');
                msgCliente.className = 'mensagem-erro';
                return;
            }

            const cliente = { nomeCompleto: nome, cpf, email, telefone };

            fetch(`${API_BASE_URL}/clientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cliente)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            })
            .then(data => {
                msgCliente.textContent = 'Cliente cadastrado com sucesso!';
                msgCliente.className = 'mensagem-sucesso';
                formCliente.reset();
                carregarClientesTabela();
            })
            .catch(error => {
                console.error('Erro ao cadastrar cliente:', error);
                msgCliente.textContent = 'Erro ao cadastrar cliente: ' + (error.message || 'Erro desconhecido');
                msgCliente.className = 'mensagem-erro';
            });
        });

        if (btnLimparCliente) {
            btnLimparCliente.addEventListener('click', function () {
                formCliente.reset();
                msgCliente.textContent = '';
                msgCliente.className = '';
            });
        }
    }

    // ==============================
    // PÁGINA: VENDA
    // ==============================
    const btnAdicionarLivro = document.getElementById('btnAdicionarLivro');
    if (btnAdicionarLivro) {
        let itensCarrinho = [];

        // Carrega clientes no select
        function carregarClientes() {
            fetch(`${API_BASE_URL}/clientes`)
                .then(response => response.json())
                .then(clientes => {
                    const selectCliente = document.getElementById('selectCliente');
                    if (!selectCliente) return;
                    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
                    clientes.forEach(cliente => {
                        const option = document.createElement('option');
                        option.value = cliente.id;
                        option.textContent = `${cliente.nomeCompleto} - CPF: ${cliente.cpf}`;
                        option.dataset.nome = cliente.nomeCompleto;
                        option.dataset.cpf = cliente.cpf;
                        option.dataset.email = cliente.email || '';
                        option.dataset.telefone = cliente.telefone || '';
                        selectCliente.appendChild(option);
                    });
                })
                .catch(error => console.error('Erro ao carregar clientes:', error));
        }

        // Carrega livros no select
        function carregarLivros() {
            fetch(`${API_BASE_URL}/livros`)
                .then(response => response.json())
                .then(livros => {
                    const selectLivro = document.getElementById('selectLivro');
                    if (!selectLivro) return;
                    selectLivro.innerHTML = '<option value="">Selecione um livro</option>';
                    livros.forEach(livro => {
                        const option = document.createElement('option');
                        option.value = livro.id;
                        option.textContent = `${livro.titulo} - ${formatarMoeda(livro.precoVenda)}`;
                        option.dataset.preco = livro.precoVenda;
                        option.dataset.titulo = livro.titulo;
                        option.dataset.autor = livro.autor;
                        option.dataset.estoque = livro.estoque;
                        selectLivro.appendChild(option);
                    });
                })
                .catch(error => console.error('Erro ao carregar livros:', error));
        }

        carregarLivros();
        carregarClientes();

        // Preenche dados pessoais quando cliente é selecionado
        const selectCliente = document.getElementById('selectCliente');
        if (selectCliente) {
            selectCliente.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                if (selectedOption.value) {
                    document.getElementById('nomeVenda').value = selectedOption.dataset.nome || '';
                    document.getElementById('cpfVenda').value = selectedOption.dataset.cpf || '';
                    document.getElementById('emailVenda').value = selectedOption.dataset.email || '';
                    document.getElementById('telefoneVenda').value = selectedOption.dataset.telefone || '';
                } else {
                    document.getElementById('nomeVenda').value = '';
                    document.getElementById('cpfVenda').value = '';
                    document.getElementById('emailVenda').value = '';
                    document.getElementById('telefoneVenda').value = '';
                }
            });
        }

        function atualizarCarrinho() {
            const lista = document.getElementById('listaCarrinho');
            const totalEl = document.getElementById('totalCarrinho');
            const qtdEl = document.getElementById('qtdItensCarrinho');

            if (itensCarrinho.length === 0) {
                lista.innerHTML = '<p class="tabela-vazia">Nenhum item adicionado.</p>';
                totalEl.textContent = 'R$ 0,00';
                qtdEl.textContent = '0';
                return;
            }

            let html = '';
            let total = 0;
            itensCarrinho.forEach((item, idx) => {
                const subtotal = item.preco * item.qtd;
                total += subtotal;
                html += `
                    <div class="item-carrinho">
                        <strong>${item.nome} × ${item.qtd}</strong>
                        <span>Subtotal: ${formatarMoeda(subtotal)}</span>
                        <button class="btn btn-secundario btn-sm" data-idx="${idx}">Remover</button>
                    </div>
                `;
            });

            lista.innerHTML = html;
            totalEl.textContent = formatarMoeda(total);
            qtdEl.textContent = itensCarrinho.length;

            lista.querySelectorAll('button[data-idx]').forEach(btn => {
                btn.addEventListener('click', function () {
                    itensCarrinho.splice(parseInt(this.dataset.idx), 1);
                    atualizarCarrinho();
                });
            });
        }

        btnAdicionarLivro.addEventListener('click', function () {
            const selectLivro = document.getElementById('selectLivro');
            const qtdInput = document.getElementById('qtdLivro');
            limparErro('selectLivro');
            limparErro('qtdLivro');

            const livroOpt = selectLivro.options[selectLivro.selectedIndex];
            const qtd = parseInt(qtdInput.value);

            let valido = true;
            if (!selectLivro.value) { mostrarErro('selectLivro', 'Selecione um livro.'); valido = false; }
            if (isNaN(qtd) || qtd < 1) { mostrarErro('qtdLivro', 'Quantidade mínima é 1.'); valido = false; }

            if (!valido) return;

            const preco = parseFloat(livroOpt.dataset.preco);
            const livroId = parseInt(livroOpt.value);
            const estoque = parseInt(livroOpt.dataset.estoque);

            if (qtd > estoque) {
                mostrarErro('qtdLivro', `Estoque insuficiente. Disponível: ${estoque}`);
                return;
            }

            itensCarrinho.push({ 
                livroId, 
                nome: livroOpt.dataset.titulo, 
                preco, 
                qtd 
            });
            atualizarCarrinho();
            selectLivro.value = '';
            qtdInput.value = 1;
        });

        const btnFinalizar = document.getElementById('btnFinalizarVenda');
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', function () {
                limparErro('selectCliente');
                const selectCliente = document.getElementById('selectCliente');

                if (!selectCliente.value) {
                    mostrarErro('selectCliente', 'Selecione um cliente antes de finalizar.');
                    return;
                }

                if (itensCarrinho.length === 0) {
                    mostrarAlerta('alertaVenda', 'erro', 'Adicione pelo menos um livro ao carrinho.');
                    return;
                }

                const venda = {
                    cliente: { id: parseInt(selectCliente.value) },
                    itens: itensCarrinho.map(item => ({
                        livro: { id: item.livroId },
                        quantidade: item.qtd,
                        precoUnitario: item.preco
                    }))
                };

                fetch(`${API_BASE_URL}/vendas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(venda)
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => Promise.reject(err));
                    }
                    return response.json();
                })
                .then(data => {
                    mostrarAlerta('alertaVenda', 'sucesso', 'Venda finalizada com sucesso!');
                    itensCarrinho = [];
                    atualizarCarrinho();
                    selectCliente.value = '';
                    document.getElementById('nomeVenda').value = '';
                    document.getElementById('cpfVenda').value = '';
                    document.getElementById('emailVenda').value = '';
                    document.getElementById('telefoneVenda').value = '';
                    carregarLivros();
                })
                .catch(error => {
                    console.error('Erro ao finalizar venda:', error);
                    mostrarAlerta('alertaVenda', 'erro', 'Erro ao finalizar venda: ' + (error.message || 'Erro desconhecido'));
                });
            });
        }

        const btnCancelar = document.getElementById('btnCancelarVenda');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', function () {
                itensCarrinho = [];
                atualizarCarrinho();
                document.getElementById('selectCliente').value = '';
                document.getElementById('nomeVenda').value = '';
                document.getElementById('cpfVenda').value = '';
                document.getElementById('emailVenda').value = '';
                document.getElementById('telefoneVenda').value = '';
                limparErro('selectCliente');
                limparErro('selectLivro');
            });
        }
    }

    // ==============================
    // PÁGINA: HISTÓRICO
    // ==============================
    const tabelaHistorico = document.getElementById('tabelaHistorico');
    if (tabelaHistorico) {
        function carregarHistorico(dataInicio, dataFim) {
            let url = `${API_BASE_URL}/vendas`;
            
            if (dataInicio && dataFim) {
                url += `/periodo?inicio=${dataInicio}T00:00:00&fim=${dataFim}T23:59:59`;
            }

            fetch(url)
                .then(response => response.json())
                .then(vendas => {
                    const tbody = tabelaHistorico.querySelector('tbody');
                    tbody.innerHTML = '';

                    if (vendas.length === 0) {
                        tbody.innerHTML = '<tr class="tabela-vazia"><td colspan="5">Nenhum registro encontrado.</td></tr>';
                        return;
                    }

                    vendas.forEach(venda => {
                        const data = new Date(venda.dataHora).toLocaleDateString('pt-BR');
                        const linha = document.createElement('tr');
                        linha.innerHTML = `
                            <td>${venda.cliente.nomeCompleto}</td>
                            <td>${data}</td>
                            <td>${venda.itens.length}</td>
                            <td>${formatarMoeda(venda.valorTotal)}</td>
                            <td><button class="btn btn-secundario btn-sm">Ver Detalhes</button></td>
                        `;
                        tbody.appendChild(linha);
                    });
                })
                .catch(error => {
                    console.error('Erro ao carregar histórico:', error);
                    const tbody = tabelaHistorico.querySelector('tbody');
                    tbody.innerHTML = '<tr class="tabela-vazia"><td colspan="5">Erro ao carregar dados.</td></tr>';
                });
        }

        carregarHistorico();

        // Filtros de data
        const filtroInicio = document.getElementById('filtroDataInicio');
        const filtroFim = document.getElementById('filtroDataFim');

        if (filtroInicio) {
            filtroInicio.addEventListener('change', () => {
                carregarHistorico(filtroInicio.value, filtroFim ? filtroFim.value : null);
            });
        }

        if (filtroFim) {
            filtroFim.addEventListener('change', () => {
                carregarHistorico(filtroInicio ? filtroInicio.value : null, filtroFim.value);
            });
        }
    }
});
