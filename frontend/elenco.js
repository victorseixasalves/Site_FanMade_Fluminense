// URL da API de elenco
const API_BASE_URL = 'http://localhost/SiteFlu_Clean/backend/api.php';

// Dados de fallback usados quando a API não está disponível
const jogadoresExemplo = [
    { id: 1, nome: 'Vitor Eudes',  posicao: 'goleiro',   numero: 1,  foto: 'Vitor_Eudes.png',  jogos: 12, defesas: 45, jogos_sem_sofrer_gol: 3,  gols: 0,  assistencias: 0 },
    { id: 2, nome: 'Thiago Silva', posicao: 'zagueiro',  numero: 3,  foto: 'Thiago_Silva.png', jogos: 15, defesas: 0,  jogos_sem_sofrer_gol: 0,  gols: 2,  assistencias: 1 },
    { id: 3, nome: 'German Cano',  posicao: 'atacantes', numero: 14, foto: 'German_Cano.png',  jogos: 18, defesas: 0,  jogos_sem_sofrer_gol: 0,  gols: 12, assistencias: 3 },
    { id: 4, nome: 'Jhon Arias',   posicao: 'meias',     numero: 21, foto: 'Jhon_Arias.png',   jogos: 16, defesas: 0,  jogos_sem_sofrer_gol: 0,  gols: 5,  assistencias: 8 },
];

const posicaoDisplay = {
    goleiro:   'Goleiro',
    zagueiro:  'Zagueiro',
    lateral:   'Lateral',
    meias:     'Meio-campo',
    atacantes: 'Atacante',
};

// Busca jogadores da API; usa fallback em caso de erro
async function fetchJogadores() {
    try {
        const response = await fetch(`${API_BASE_URL}/todos`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('API indisponível, usando dados de exemplo:', error);
        return jogadoresExemplo;
    }
}

// Gera o HTML do card de um jogador
function criarCardJogador(jogador) {
    const isGoleiro = jogador.posicao === 'goleiro';

    const stats = isGoleiro ? `
        <div class="stat-item"><span class="stat-value">${jogador.jogos}</span><span class="stat-label">Jogos</span></div>
        <div class="stat-item"><span class="stat-value">${jogador.defesas}</span><span class="stat-label">Defesas</span></div>
        <div class="stat-item"><span class="stat-value">${jogador.jogos_sem_sofrer_gol}</span><span class="stat-label">Jogos sem sofrer gols</span></div>
    ` : `
        <div class="stat-item"><span class="stat-value">${jogador.jogos}</span><span class="stat-label">Jogos</span></div>
        <div class="stat-item"><span class="stat-value">${jogador.gols}</span><span class="stat-label">Gols</span></div>
        <div class="stat-item"><span class="stat-value">${jogador.assistencias}</span><span class="stat-label">Assistências</span></div>
    `;

    return `
        <div class="player-card" data-position="${jogador.posicao}">
            <div class="player-image">
                <img src="jogadores_fotos/${jogador.foto}" alt="${jogador.nome}">
                <div class="player-number">${jogador.numero}</div>
                <div class="player-overlay">
                    <div class="player-stats-detailed">
                        <h4>${jogador.nome}</h4>
                        <div class="stats-grid">${stats}</div>
                    </div>
                </div>
            </div>
            <div class="player-info">
                <h3 class="player-name">${jogador.nome}</h3>
                <p class="player-position">${posicaoDisplay[jogador.posicao] || jogador.posicao}</p>
                <div class="player-basic-stats">
                    <span>Camisa ${jogador.numero}</span>
                    <span>${jogador.jogos} jogos</span>
                </div>
            </div>
        </div>
    `;
}

// Configura os botões de filtro por posição
function configurarFiltros() {
    const filterButtons = document.querySelectorAll('.position-btn');
    const playerCards   = document.querySelectorAll('.player-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const posicao = button.getAttribute('data-position');
            playerCards.forEach(card => {
                card.style.display = (posicao === 'todos' || card.getAttribute('data-position') === posicao)
                    ? 'block' : 'none';
            });
        });
    });
}

// Carrega e renderiza os jogadores na grade
async function carregarJogadores() {
    const grid = document.querySelector('.players-grid');
    if (!grid) return;

    const jogadores = await fetchJogadores();
    grid.innerHTML = jogadores.map(criarCardJogador).join('');

    // Animação de entrada com IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.player-card').forEach(card => {
        card.style.cssText += 'opacity:0;transform:translateY(30px);transition:opacity 0.6s ease,transform 0.6s ease;';
        observer.observe(card);
    });

    configurarFiltros();
}

document.addEventListener('DOMContentLoaded', carregarJogadores);
