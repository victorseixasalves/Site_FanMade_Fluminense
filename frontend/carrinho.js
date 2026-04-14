// Gerenciador do Carrinho de Compras — Fluminense FC
class CarrinhoManager {
    constructor() {
        this.carrinho = JSON.parse(localStorage.getItem('carrinho_fluminense')) || [];
        this.apiUrl   = 'http://localhost/SiteFlu_Clean/backend/loja_api.php';
        this.init();
    }

    init() {
        this.atualizarContador();
        this.configurarEventListeners();
    }

    configurarEventListeners() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.fecharModal();
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.fecharModal();
        });
    }

    // ── API ─────────────────────────────────────────────────────────────────

    async verificarDisponibilidade(produtoId, quantidade) {
        try {
            const params = new URLSearchParams({ rota: 'disponibilidade', id: produtoId, quantidade });
            const response = await fetch(`${this.apiUrl}?${params}`);
            return await response.json();
        } catch {
            return { disponivel: false };
        }
    }

    async buscarProduto(produtoId) {
        try {
            const params = new URLSearchParams({ rota: 'produto', id: produtoId });
            const response = await fetch(`${this.apiUrl}?${params}`);
            return response.ok ? await response.json() : null;
        } catch {
            return null;
        }
    }

    // ── Operações do Carrinho ────────────────────────────────────────────────

    async adicionarProduto(produtoId, quantidade = 1) {
        try {
            const disponibilidade = await this.verificarDisponibilidade(produtoId, quantidade);
            if (!disponibilidade.disponivel) {
                this.mostrarNotificacao('Produto indisponível ou estoque insuficiente', 'error');
                return false;
            }

            const produto = await this.buscarProduto(produtoId);
            if (!produto) {
                this.mostrarNotificacao('Produto não encontrado', 'error');
                return false;
            }

            const itemExistente = this.carrinho.find(item => item.id === produtoId);
            if (itemExistente) {
                const novaQtd = itemExistente.quantidade + quantidade;
                if (novaQtd > produto.estoque) {
                    this.mostrarNotificacao('Quantidade máxima disponível atingida', 'warning');
                    return false;
                }
                itemExistente.quantidade = novaQtd;
            } else {
                this.carrinho.push({
                    id:        produto.id,
                    nome:      produto.nome_produto,
                    preco:     produto.valor,
                    foto:      produto.foto_produto,
                    quantidade,
                    estoque:   produto.estoque,
                    categoria: produto.categoria,
                });
            }

            this.salvarCarrinho();
            this.atualizarContador();
            this.mostrarNotificacao('Produto adicionado ao carrinho!', 'success');
            return true;
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            this.mostrarNotificacao('Erro ao adicionar produto', 'error');
            return false;
        }
    }

    removerProduto(produtoId) {
        this.carrinho = this.carrinho.filter(item => item.id !== produtoId);
        this.salvarCarrinho();
        this.atualizarContador();
        this.renderizarCarrinho();
        this.mostrarNotificacao('Produto removido do carrinho', 'info');
    }

    async alterarQuantidade(produtoId, novaQuantidade) {
        if (novaQuantidade <= 0) {
            this.removerProduto(produtoId);
            return true;
        }

        const item = this.carrinho.find(item => item.id === produtoId);
        if (!item) return false;

        try {
            const disp = await this.verificarDisponibilidade(produtoId, novaQuantidade);
            if (!disp.disponivel) {
                this.mostrarNotificacao('Quantidade não disponível em estoque', 'warning');
                return false;
            }
            item.quantidade = novaQuantidade;
            this.salvarCarrinho();
            this.atualizarContador();
            this.renderizarCarrinho();
            return true;
        } catch (error) {
            console.error('Erro ao alterar quantidade:', error);
            return false;
        }
    }

    limparCarrinho() {
        if (confirm('Deseja realmente limpar o carrinho?')) {
            this.carrinho = [];
            this.salvarCarrinho();
            this.atualizarContador();
            this.renderizarCarrinho();
            this.mostrarNotificacao('Carrinho limpo', 'info');
        }
    }

    // ── Cálculos ─────────────────────────────────────────────────────────────

    calcularTotal() {
        return this.carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    calcularQuantidadeTotal() {
        return this.carrinho.reduce((total, item) => total + item.quantidade, 0);
    }

    // ── Modal ────────────────────────────────────────────────────────────────

    abrirModal() {
        this.renderizarCarrinho();
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    fecharModal() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    atualizarContador() {
        const contador  = document.getElementById('cart-count');
        const quantidade = this.calcularQuantidadeTotal();
        if (contador) {
            contador.textContent = quantidade;
            contador.style.display = quantidade > 0 ? 'flex' : 'none';
        }
        document.title = quantidade > 0 ? `(${quantidade}) Loja - Fluminense FC` : 'Loja - Fluminense FC';
    }

    // ── Renderização ─────────────────────────────────────────────────────────

    renderizarCarrinho() {
        const container      = document.getElementById('cart-items');
        const totalContainer = document.getElementById('cart-total');
        if (!container) return;

        if (this.carrinho.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Seu carrinho está vazio</p>
                    <button class="cta-btn" onclick="carrinhoManager.fecharModal()" style="margin-top:1rem;">
                        Continuar Comprando
                    </button>
                </div>
            `;
            if (totalContainer) totalContainer.style.display = 'none';
            return;
        }

        container.innerHTML = `
            <div style="margin-bottom:1rem;text-align:right;">
                <button onclick="carrinhoManager.limparCarrinho()"
                    style="background:#e74c3c;color:white;border:none;padding:0.5rem 1rem;border-radius:4px;cursor:pointer;">
                    <i class="fas fa-trash"></i> Limpar Carrinho
                </button>
            </div>
            ${this.carrinho.map(item => this.renderizarItem(item)).join('')}
        `;

        if (totalContainer) {
            const total    = this.calcularTotal();
            const qtdTotal = this.calcularQuantidadeTotal();
            totalContainer.innerHTML = `
                <div style="margin-bottom:1rem;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
                        <span>Itens (${qtdTotal}):</span>
                        <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
                        <span>Frete:</span>
                        <span style="color:#27ae60;">Grátis</span>
                    </div>
                    <hr style="margin:1rem 0;">
                    <div style="display:flex;justify-content:space-between;font-size:1.2rem;font-weight:bold;">
                        <span>Total:</span>
                        <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
                <button class="cart-checkout" onclick="carrinhoManager.finalizarCompra()">
                    <i class="fas fa-credit-card"></i> Finalizar Compra
                </button>
                <button onclick="carrinhoManager.fecharModal()"
                    style="width:100%;margin-top:0.5rem;background:transparent;border:1px solid #8B1538;color:#8B1538;padding:0.5rem;border-radius:4px;cursor:pointer;">
                    Continuar Comprando
                </button>
            `;
            totalContainer.style.display = 'block';
        }
    }

    renderizarItem(item) {
        const subtotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
        const preco    = item.preco.toFixed(2).replace('.', ',');
        const categoria = {
            camisas: 'Camisas', acessorios: 'Acessórios',
            casa: 'Casa & Decoração', infantil: 'Infantil', geral: 'Geral',
        }[item.categoria] || item.categoria;

        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="produtos/${item.foto}" alt="${item.nome}" onerror="this.src='flu.png'">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.nome}</div>
                    <div class="cart-item-price">R$ ${preco}</div>
                    <div style="font-size:0.8rem;color:#7f8c8d;margin-top:0.25rem;">${categoria}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="carrinhoManager.alterarQuantidade(${item.id}, ${item.quantidade - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantidade}"
                               min="1" max="${item.estoque}"
                               onchange="carrinhoManager.alterarQuantidade(${item.id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="carrinhoManager.alterarQuantidade(${item.id}, ${item.quantidade + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="quantity-btn" onclick="carrinhoManager.removerProduto(${item.id})"
                                style="margin-left:1rem;background:#e74c3c;color:white;" title="Remover item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div style="margin-top:0.5rem;font-weight:600;color:#8B1538;">
                        Subtotal: R$ ${subtotal}
                    </div>
                </div>
            </div>
        `;
    }

    // ── Checkout ─────────────────────────────────────────────────────────────

    async finalizarCompra() {
        if (this.carrinho.length === 0) {
            this.mostrarNotificacao('Carrinho vazio', 'warning');
            return;
        }

        try {
            for (const item of this.carrinho) {
                const disp = await this.verificarDisponibilidade(item.id, item.quantidade);
                if (!disp.disponivel) {
                    this.mostrarNotificacao(`"${item.nome}" não está mais disponível na quantidade solicitada`, 'error');
                    return;
                }
            }

            const total   = this.calcularTotal();
            const qtdTotal = this.calcularQuantidadeTotal();
            const resumo  = this.carrinho.map(i =>
                `• ${i.nome} (${i.quantidade}x) - R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')}`
            ).join('\n');

            const confirmacao = confirm(
                `🛒 RESUMO DA COMPRA\n\n${resumo}\n\n` +
                `📦 Total de itens: ${qtdTotal}\n` +
                `💰 Valor total: R$ ${total.toFixed(2).replace('.', ',')}\n` +
                `🚚 Frete: Grátis\n\nConfirmar compra?`
            );

            if (confirmacao) {
                this.mostrarNotificacao('Redirecionando para pagamento...', 'info');
                setTimeout(() => {
                    alert('🎉 Compra finalizada com sucesso!\n\nObrigado por escolher o Fluminense FC!\nVocê receberá um e-mail com os detalhes da compra.');
                    this.carrinho = [];
                    this.salvarCarrinho();
                    this.atualizarContador();
                    this.fecharModal();
                    if (typeof carregarProdutos === 'function') carregarProdutos();
                }, 1500);
            }
        } catch (error) {
            console.error('Erro ao finalizar compra:', error);
            this.mostrarNotificacao('Erro ao processar compra. Tente novamente.', 'error');
        }
    }

    // ── Utilitários ──────────────────────────────────────────────────────────

    salvarCarrinho() {
        localStorage.setItem('carrinho_fluminense', JSON.stringify(this.carrinho));
    }

    mostrarNotificacao(mensagem, tipo = 'info') {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;max-width:300px;';
            document.body.appendChild(container);
        }

        const cores = { success: '#27ae60', error: '#e74c3c', warning: '#f39c12', info: '#3498db' };
        const notif = document.createElement('div');
        notif.style.cssText = `
            background:${cores[tipo] || cores.info};color:white;padding:1rem;border-radius:8px;
            margin-bottom:10px;box-shadow:0 4px 15px rgba(0,0,0,0.2);
            transform:translateX(100%);transition:transform 0.3s ease;font-weight:500;
        `;
        notif.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;">
                <span>${mensagem}</span>
                <button onclick="this.parentElement.parentElement.remove()"
                    style="background:none;border:none;color:white;font-size:1.2rem;cursor:pointer;margin-left:1rem;">×</button>
            </div>
        `;
        container.appendChild(notif);
        setTimeout(() => { notif.style.transform = 'translateX(0)'; }, 100);
        setTimeout(() => {
            notif.style.transform = 'translateX(100%)';
            setTimeout(() => { notif?.remove(); }, 300);
        }, 4000);
    }
}

// ── Inicialização ─────────────────────────────────────────────────────────────
let carrinhoManager;

document.addEventListener('DOMContentLoaded', function () {
    carrinhoManager = new CarrinhoManager();

    const cartIcon  = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');

    if (cartIcon)  cartIcon.addEventListener('click', () => carrinhoManager.abrirModal());
    if (closeCart) closeCart.addEventListener('click', () => carrinhoManager.fecharModal());
});

// Funções globais para compatibilidade com chamadas inline no HTML
function adicionarAoCarrinho(produtoId, quantidade = 1) {
    return carrinhoManager?.adicionarProduto(produtoId, quantidade);
}

function abrirCarrinho()  { carrinhoManager?.abrirModal(); }
function fecharCarrinho() { carrinhoManager?.fecharModal(); }
