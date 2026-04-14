// URL da API da loja
const API_URL = '../backend/loja_api.php';

// Busca produtos da API com filtros opcionais
async function fetchProdutos(params = {}) {
    const query = new URLSearchParams({ rota: 'produtos', ...params }).toString();
    try {
        const response = await fetch(`${LOJA_API_URL}?${query}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('API indisponível, usando produtos de exemplo:', error);
        return [
            { id: 1, nome_produto: 'Camisa Titular 2025',        foto_produto: 'camisa_titular_2025.png',  valor: '239.90' },
            { id: 2, nome_produto: 'Camisa Reserva 2025',        foto_produto: 'camisa_reserva_2025.png',  valor: '239.90' },
            { id: 3, nome_produto: 'Camisa Infantil 2025',       foto_produto: 'camisa_infantil_2025.png', valor: '189.90' },
            { id: 4, nome_produto: 'Boné Oficial Fluminense',    foto_produto: 'bone_oficial.png',         valor: '79.90'  },
            { id: 5, nome_produto: 'Cachecol Tricolor',          foto_produto: 'cachecol_tricolor.png',    valor: '59.90'  },
            { id: 6, nome_produto: 'Chaveiro Escudo',            foto_produto: 'chaveiro_escudo.png',      valor: '29.90'  },
            { id: 7, nome_produto: 'Mochila Oficial Fluminense', foto_produto: 'mochila_oficial.png',      valor: '129.90' },
        ];
    }
}

// Gera o HTML do card de um produto
function criarCardProduto(produto) {
    const valor = parseFloat(produto.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `
        <div class="product-card" data-product-id="${produto.id}">
            <div class="product-image">
                <img src="produtos/${produto.foto_produto}" alt="${produto.nome_produto}" onerror="this.src='flu.png'">
                <div class="product-overlay">
                    <div class="product-actions">
                        <button class="add-to-cart-btn"
                            onclick="adicionarAoCarrinho(${produto.id}, 1)">
                            <i class="fas fa-shopping-cart"></i>
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${produto.nome_produto}</h3>
                <div class="product-price">
                    <span class="price-current">R$ ${valor}</span>
                </div>
            </div>
        </div>
    `;
}

// Carrega e renderiza os produtos na grade
async function carregarProdutos(params = {}) {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    const produtos = await fetchProdutos(params);
    grid.innerHTML = produtos.map(criarCardProduto).join('');
}

document.addEventListener('DOMContentLoaded', () => carregarProdutos());
