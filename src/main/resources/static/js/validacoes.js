// ========================================
// validacoes.js — Livraria Fácil
// Validações e funcionalidades dinâmicas
// ========================================

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
    cpf = cpf.replace(/[\D]/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
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
    let v = input.value.replace(/\D/g, '');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = v;
}

function mascaraTelefone(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length <= 10) {
        v = v.replace(/(\d{2})(\d)/, '($1) $2');
        v = v.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        v = v.replace(/(\d{2})(\d)/, '($1) $2');
        v = v.replace(/(\d{5})(\d)/, '$1-$2');
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

        formLivro.addEventListener('submit', function (e) {
            e.preventDefault();

            const campos = ['isbn', 'titulo', 'autor', 'precoCusto', 'precoVenda', 'estoque'];
            campos.forEach(id => limparErro(id));

            const isbn       = document.getElementById('isbn').value.trim();
            const titulo     = document.getElementById('titulo').value.trim();
            const autor      = document.getElementById('autor').value.trim();
            const categoria  = document.getElementById('categoria').value.trim();
            const precoCusto = parseFloat(document.getElementById('precoCusto').value);
            const precoVenda = parseFloat(document.getElementById('precoVenda').value);
            const estoque    = parseInt(document.getElementById('estoque').value);

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

            // Adiciona na tabela
            const tbody = document.querySelector('#tabelaLivros tbody');
            const vazia = tbody.querySelector('.tabela-vazia');
            if (vazia) vazia.remove();

            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${isbn}</td>
                <td>${titulo}</td>
                <td>${autor}</td>
                <td>${categoria}</td>
                <td>${formatarMoeda(precoVenda)}</td>
                <td>${estoque}</td>
            `;
            tbody.appendChild(linha);

            // Salva no localStorage
            const livro = { isbn, titulo, autor, categoria, precoCusto, precoVenda, estoque };
            const livros = JSON.parse(localStorage.getItem('livros') || '[]');
            livros.push(livro);
            localStorage.setItem('livros', JSON.stringify(livros));

            mostrarAlerta('alertaLivro', 'sucesso', 'Livro cadastrado com sucesso!');
            formLivro.reset();
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
        const msgCliente       = document.getElementById('msgCliente');

        const cpfInput      = document.getElementById('cpfCliente');
        const telefoneInput = document.getElementById('telefoneCliente');

        if (cpfInput)      cpfInput.addEventListener('input', () => mascaraCPF(cpfInput));
        if (telefoneInput) telefoneInput.addEventListener('input', () => mascaraTelefone(telefoneInput));

        formCliente.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome     = document.getElementById('nomeCliente').value.trim();
            const cpf      = document.getElementById('cpfCliente').value.trim();
            const email    = document.getElementById('emailCliente').value.trim();
            const telefone = document.getElementById('telefoneCliente').value.trim();

            let erros = [];

            if (!nome) erros.push('Nome completo é obrigatório.');

            if (!cpf) {
                erros.push('CPF é obrigatório.');
            } else if (!validarCPF(cpf)) {
                erros.push('CPF inválido.');
            }

            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                erros.push('E-mail inválido.');
            }

            if (erros.length > 0) {
                msgCliente.textContent = erros.join(' ');
                msgCliente.className = 'mensagem-erro';
                return;
            }

            const tbody = document.querySelector('#tabelaClientes tbody');
            const vazia = tbody.querySelector('.tabela-vazia');
            if (vazia) vazia.remove();

            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${nome}</td>
                <td>${cpf}</td>
                <td>${email}</td>
                <td>${telefone}</td>
                <td><button class="btn btn-secundario btn-sm">Editar</button></td>
            `;
            tbody.appendChild(linha);

            // Salva no localStorage
            const cliente = { nome, cpf, email, telefone };
            const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
            clientes.push(cliente);
            localStorage.setItem('clientes', JSON.stringify(clientes));

            msgCliente.textContent = 'Cliente cadastrado com sucesso!';
            msgCliente.className = 'mensagem-sucesso';
            formCliente.reset();
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

        // Carrega clientes no select
        function carregarClientes() {
            const selectCliente = document.getElementById('selectCliente');
            if (!selectCliente) return;

            const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
            selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';

            clientes.forEach((cliente, index) => {
                const option = document.createElement('option');
                option.value = index.toString();
                option.textContent = `${cliente.nome} - CPF: ${cliente.cpf}`;
                option.dataset.nome = cliente.nome;
                option.dataset.cpf = cliente.cpf;
                option.dataset.email = cliente.email;
                option.dataset.telefone = cliente.telefone;
                selectCliente.appendChild(option);
            });
        }

        // Carrega livros no select
        function carregarLivros() {
            const selectLivro = document.getElementById('selectLivro');
            if (!selectLivro) return;

            const livros = JSON.parse(localStorage.getItem('livros') || '[]');
            selectLivro.innerHTML = '<option value="">Selecione um livro</option>';

            livros.forEach((livro, index) => {
                const option = document.createElement('option');
                option.value = index.toString();
                option.textContent = `${livro.titulo} - ${formatarMoeda(livro.precoVenda)}`;
                option.dataset.preco = livro.precoVenda.toString();
                option.dataset.titulo = livro.titulo;
                option.dataset.autor = livro.autor;
                selectLivro.appendChild(option);
            });
        }

        // Carrega livros e clientes ao iniciar
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
                    // Limpa campos se nenhum cliente selecionado
                    document.getElementById('nomeVenda').value = '';
                    document.getElementById('cpfVenda').value = '';
                    document.getElementById('emailVenda').value = '';
                    document.getElementById('telefoneVenda').value = '';
                }
            });
        }

        let itensCarrinho = [];

        function atualizarCarrinho() {
            const lista    = document.getElementById('listaCarrinho');
            const totalEl  = document.getElementById('totalCarrinho');
            const qtdEl    = document.getElementById('qtdItensCarrinho');

            if (itensCarrinho.length === 0) {
                lista.innerHTML = '<p class="tabela-vazia">Nenhum item adicionado.</p>';
                totalEl.textContent = 'R$ 0,00';
                qtdEl.textContent = '0';
                return;
            }

            let html  = '';
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
            const qtdInput    = document.getElementById('qtdLivro');

            limparErro('selectLivro');
            limparErro('qtdLivro');

            const livroOpt = selectLivro.options[selectLivro.selectedIndex];
            const qtd      = parseInt(qtdInput.value);

            let valido = true;
            if (!selectLivro.value) { mostrarErro('selectLivro', 'Selecione um livro.'); valido = false; }
            if (isNaN(qtd) || qtd < 1) { mostrarErro('qtdLivro', 'Quantidade mínima é 1.'); valido = false; }
            if (!valido) return;

            const preco = parseFloat(livroOpt.dataset.preco);
            itensCarrinho.push({ nome: livroOpt.text.split(' - ')[0], preco, qtd });
            atualizarCarrinho();

            selectLivro.value = '';
            qtdInput.value    = 1;
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

                // Registra no histórico via localStorage
                const venda = {
                    cliente: selectCliente.options[selectCliente.selectedIndex].text,
                    data: new Date().toLocaleDateString('pt-BR'),
                    itens: itensCarrinho.length,
                    total: itensCarrinho.reduce((acc, i) => acc + i.preco * i.qtd, 0)
                };
                const historico = JSON.parse(localStorage.getItem('historico') || '[]');
                historico.push(venda);
                localStorage.setItem('historico', JSON.stringify(historico));

                mostrarAlerta('alertaVenda', 'sucesso', 'Venda finalizada com sucesso!');
                itensCarrinho = [];
                atualizarCarrinho();
                document.getElementById('selectCliente').value = '';
            });
        }

        const btnCancelar = document.getElementById('btnCancelarVenda');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', function () {
                itensCarrinho = [];
                atualizarCarrinho();
                document.getElementById('selectCliente').value = '';
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
            const historico = JSON.parse(localStorage.getItem('historico') || '[]');
            const tbody = tabelaHistorico.querySelector('tbody');
            tbody.innerHTML = '';

            let filtrado = historico;

            if (dataInicio || dataFim) {
                filtrado = historico.filter(v => {
                    const partes = v.data.split('/');
                    const dataVenda = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
                    if (dataInicio && dataVenda < new Date(dataInicio)) return false;
                    if (dataFim   && dataVenda > new Date(dataFim))   return false;
                    return true;
                });
            }

            if (filtrado.length === 0) {
                tbody.innerHTML = '<tr class="tabela-vazia"><td colspan="5">Nenhum registro encontrado.</td></tr>';
                return;
            }

            filtrado.forEach(venda => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${venda.cliente}</td>
                    <td>${venda.data}</td>
                    <td>${venda.itens}</td>
                    <td>${formatarMoeda(venda.total)}</td>
                    <td><button class="btn btn-secundario btn-sm">Ver Detalhes</button></td>
                `;
                tbody.appendChild(linha);
            });
        }

        carregarHistorico();

        // Filtros de data
        const filtroInicio = document.getElementById('filtroDataInicio');
        const filtroFim    = document.getElementById('filtroDataFim');

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
